package schema

import (
	"context"
	"fmt"

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

func convertSchemaKind(kind string) types.SchemaKind {

	schemaKind := types.SchemaKind_STRING
	switch kind {
	case "LIST":
		schemaKind = types.SchemaKind_LIST
	case "BOOL":
		schemaKind = types.SchemaKind_BOOL
	case "INT":
		schemaKind = types.SchemaKind_INT
	case "FLOAT":
		schemaKind = types.SchemaKind_FLOAT
	case "STRING":
		schemaKind = types.SchemaKind_STRING
	case "BYTES":
		schemaKind = types.SchemaKind_BYTES
	case "LINK":
		schemaKind = types.SchemaKind_LINK
	}

	return schemaKind
}

func bootstrapCreateSchemaCommand(ctx context.Context, logger *golog.Logger) (createSchemaCmd *cobra.Command) {
	createSchemaCmd = &cobra.Command{
		Use:   "create",
		Short: "Use: create",

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

			logger.Info(status.Info, "Creating schema...")
			schemaPrompt := promptui.Prompt{
				Label: "Enter the Schema Label",
			}
			schemaLabel, err := schemaPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fields := make(map[string]types.SchemaKind)

			prompt := promptui.Prompt{
				Label: "Enter your Schema Fields",
			}

			var repeat bool
			for !repeat {
				// make schemaFields []string
				schemaField, err := prompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
				}
				// for every schemaFields, prompt for the type of the field
				selectSchemaKind := promptui.Select{
					Label: "Select a Schema Field",
					Items: []string{
						"LIST",
						"BOOL",
						"INT",
						"FLOAT",
						"STRING",
						"BYTES",
						"LINK",
					},
				}
				_, result, err := selectSchemaKind.Run()
				if err != nil {
					fmt.Printf("Prompt failed %v\n", err)
					return
				}
				sk := convertSchemaKind(result)
				fields[schemaField] = sk
				repeat = prompts.QuitSelector("Create another Schema Field?")
			}

			createSchemaRequest := rtmv1.CreateSchemaRequest{
				Label:  schemaLabel,
				Fields: fields,
			}

			// create schema
			logger.Info(status.Debug, "Schema request: ", createSchemaRequest)
			createSchemaResult, err := m.CreateSchema(createSchemaRequest)
			if err != nil {
				logger.Fatalf(status.Error("CreateSchema Error: "), err)
				return
			}
			logger.Info(status.Success("Create Schema Successful"))
			// desearialize the scehma result to get the schema did
			logger.Info(status.Debug, "Schema WhatIs: ", createSchemaResult.WhatIs.Schema)
		},
	}
	return
}
