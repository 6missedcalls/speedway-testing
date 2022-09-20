package schema

import (
	"context"
	"fmt"
	"strings"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
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

			var label string
			var createSchemaRequest rtmv1.CreateSchemaRequest
			if label, err = cmd.Flags().GetString("label"); err == nil && label == "" {
				label = (&prompter.Prompter{
					Message: "Schema Label",
				}).Prompt()
				if label == "" {
					logger.Fatalf(status.Error("Label cannot be empty"))
					return
				}
			}

			fields := make(map[string]types.SchemaKind)
			if path, err := cmd.Flags().GetString("file"); err == nil && path == "" {
				// Prompt the user for a list of label:IPLD_TYPE to create a schema
				// IPLD_TYPE can be one of the following: list, bool, int, float, string, bytes & link
				// e.g. "name:string,age:int"
				result := (&prompter.Prompter{
					Message: "✔️ Enter a list (separated by commas) of label:type for the schema",
				}).Prompt()
				if result == "" {
					logger.Fatalf(status.Error("Schema fields cannot be empty"))
					return
				}

				result = strings.ReplaceAll(result, " ", "")
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
				createSchemaRequest, err = utils.LoadSchemaFieldDefinitionFromDisk(path)
				if err != nil {
					logger.Fatalf("Error while loading schema fields from disk %s", err)
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
			logger.Infof("└── Did: %s", createSchemaResult.WhatIs.Did)
		},
	}
	createSchemaCmd.PersistentFlags().String("label", "", "label of the schema")
	createSchemaCmd.PersistentFlags().String("file", "", "an absolute path to an object definition matching a provided schema")
	return
}
