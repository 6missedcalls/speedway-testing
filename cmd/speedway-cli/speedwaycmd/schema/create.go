package schema

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func convertSchemaKind(kind string) rtmv1.CreateSchemaRequest_SchemaKind {

	schemaKind := rtmv1.CreateSchemaRequest_SCHEMA_KIND_STRING
	switch kind {
	case "LIST":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_LIST
	case "BOOL":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_BOOL
	case "INT":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_INT
	case "FLOAT":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_FLOAT
	case "STRING":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_STRING
	case "BYTES":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_BYTES
	case "LINK":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_LINK
	}

	return schemaKind
}

func bootstrapCreateSchemaCommand(ctx context.Context) (createSchemaCmd *cobra.Command) {
	createSchemaCmd = &cobra.Command{
		Use:   "create",
		Short: "Use: create",

		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := account.Login(m, loginRequest)
			if err != nil {
				fmt.Println(status.Error, ("Login Error: "), err)
				return
			}
			if loginResult.Success {
				fmt.Println(status.Success, ("Login Successful"))
			} else {
				fmt.Println(status.Error, ("Login Failed"))
				return
			}

			fmt.Println(status.Info, "Creating schema...")
			schemaPrompt := promptui.Prompt{
				Label: "Enter the Schema Label",
			}
			schemaLabel, err := schemaPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fields := make(map[string]rtmv1.CreateSchemaRequest_SchemaKind)

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
				repeat = prompts.QuitSelector(ctx)
			}

			createSchemaRequest := rtmv1.CreateSchemaRequest{
				Label:  schemaLabel,
				Fields: fields,
			}

			// create schema
			fmt.Println(status.Debug, "Schema request: ", createSchemaRequest)
			createSchemaResult, err := m.CreateSchema(createSchemaRequest)
			if err != nil {
				fmt.Println(status.Error, "CreateSchema Error: ", err)
				return
			}
			fmt.Println(status.Success, "Create Schema Successful")
			// desearialize the scehma result to get the schema did
			whatIs := utils.DeserializeWhatIs(createSchemaResult.WhatIs)
			fmt.Println(status.Debug, "Schema WhatIs: ", whatIs.Schema)
		},
	}
	return
}
