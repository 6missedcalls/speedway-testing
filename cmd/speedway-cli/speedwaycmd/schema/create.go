package schema

import (
	"context"
	"fmt"
	"strings"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

// Method to create a new schema
// Command Example: speedway schema create
func bootstrapCreateSchemaCommand(ctx context.Context, logger *golog.Logger) (createSchemaCmd *cobra.Command) {
	createSchemaCmd = &cobra.Command{
		Use:   "create",
		Short: "Create a new schema on the Sonr Network.",
		Long:  "Creates a Schema definition with either a provided file path with the --file flag. If no flags are provided data will be prompted for via the cli prompt.",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatalf(status.Error("Login Failed"))
				return
			}

			logger.Info("Creating schema...")

			var label string = ""
			var createSchemaRequest rtmv1.CreateSchemaRequest
			if label, err = cmd.Flags().GetString("label"); err == nil && label == "" {
				schemaPrompt := promptui.Prompt{
					Label: "Enter the Schema Label",
				}
				label, err = schemaPrompt.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			fields := make(map[string]types.SchemaKind)
			if field, err := cmd.Flags().GetString("field"); err == nil && field == "" {
				// Prompt the user for a list of label:field to create a schema
				// label:field is a comma separated string
				// e.g. "name:string,age:int"
				fieldsPrompt := promptui.Prompt{
					Label: "Enter a list (sperated by commas) of label:kind for the schema",
				}

				result, err := fieldsPrompt.Run()
				if err != nil {
					logger.Fatalf(status.Error("Command failed"), err)
					return
				}

				// Parse the result into a types.Schema
				for _, field := range strings.Split(result, ",") {
					fieldSplit := strings.Split(field, ":")
					if len(fieldSplit) != 2 {
						logger.Fatalf(status.Error("Invalid field format"), err)
						return
					}
					// take the second element of the split and convert it to a types.SchemaKind
					kind, err := utils.ConvertSchemaKind(fieldSplit[1])
					if err != nil {
						logger.Fatalf(status.Error("Invalid field format"), err)
						return
					}
					fields[fieldSplit[0]] = kind
					fmt.Println(fieldSplit[0], kind)
				}

				createSchemaRequest = rtmv1.CreateSchemaRequest{
					Label:  label,
					Fields: fields,
				}
			} else {
				// Parse the field flag into a types.Schema
				for _, field := range strings.Split(field, ",") {
					fieldSplit := strings.Split(field, ":")
					if len(fieldSplit) != 2 {
						logger.Fatalf(status.Error("Invalid field format"), err)
						return
					}
					// take the second element of the split and convert it to a types.SchemaKind
					kind, err := utils.ConvertSchemaKind(fieldSplit[1])
					if err != nil {
						logger.Fatalf(status.Error("Invalid field format"), err)
						return
					}
					fields[fieldSplit[0]] = kind
					fmt.Println(fieldSplit[0], kind)
				}
				createSchemaRequest = rtmv1.CreateSchemaRequest{
					Label:  label,
					Fields: fields,
				}
			}

			// print each createSchemaRequest.Fields as a tree
			logger.Infof("Creating schema with the following fields:")
			for field, kind := range createSchemaRequest.Fields {
				logger.Infof("└── %s: %s", field, kind)
			}

			// create the schema
			createSchemaResult, err := m.CreateSchema(createSchemaRequest)
			if err != nil {
				logger.Fatalf(status.Error("CreateSchema Error: "), err)
				return
			}
			logger.Info(status.Success("Create Schema Successful"))

			logger.Infof("🚀 WhatIs for Schema Broadcasted")
			logger.Infof("├── Creator: %s", createSchemaResult.WhatIs.Creator)
			logger.Infof("├── Cid: %s", createSchemaResult.WhatIs.Schema.Cid)
			logger.Infof("└── Did: %s", createSchemaResult.WhatIs.Did)
		},
	}
	createSchemaCmd.Flags().StringP("label", "l", "", "The label for the schema")
	createSchemaCmd.Flags().StringP("field", "f", "", "Field definition in the format of label:kind")
	return
}
