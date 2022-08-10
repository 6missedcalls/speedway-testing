package schema

import (
	"context"
	"fmt"
	"os"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/resolver"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func convertSchemaKind(kind string) rtmv1.CreateSchemaRequest_SchemaKind {

	schemaKind := rtmv1.CreateSchemaRequest_SCHEMA_KIND_ANY
	switch kind {
	case "ANY":
		schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_ANY
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
			fmt.Println(loginRequest)

			m := initmotor.InitMotor()

			loginResult, err := m.Login(loginRequest)
			if loginResult.Success {
				fmt.Println(chalk.Green.Color("Login Successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login Failed"))
				os.Exit(1)
			}

			fmt.Println(chalk.Green, "Creating schema...", chalk.Reset)
			schemaPrompt := promptui.Prompt{
				Label: "Enter the Schema Label",
			}
			schemaLabel, err := schemaPrompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			fields := make(map[string]rtmv1.CreateSchemaRequest_SchemaKind)

			prompt := promptui.Prompt{
				Label: "Enter your Schema Fields",
			}

			var repeat string
			for repeat != "n" {
				// make schemaFields []string
				schemaField, err := prompt.Run()
				if err != nil {
					fmt.Printf("Prompt failed %v\n", err)
					return
				}
				// for every schemaFields, prompt for the type of the field
				selectSchemaKind := promptui.Select{
					Label: "Select a Schema Field",
					Items: []string{
						"ANY",
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
				repeatPrompt := promptui.Prompt{
					Label: "Repeat?",
				}
				repeat, err = repeatPrompt.Run()
				if err != nil {
					fmt.Printf("Prompt failed %v\n", err)
					return
				}
			}

			createSchemaRequest := rtmv1.CreateSchemaRequest{
				Label:  schemaLabel,
				Fields: fields,
			}

			// create schema
			fmt.Println(chalk.Yellow, "Schema request: ", createSchemaRequest)
			createSchemaResult, err := m.CreateSchema(createSchemaRequest)
			if err != nil {
				fmt.Println(chalk.Red.Color("Create Schema Failed"))
			}
			fmt.Println(chalk.Green.Color("Create Schema Successful"))
			// desearialize the scehma result to get the schema did
			whatIs := resolver.DeserializeWhatIs(createSchemaResult.WhatIs)
			definition := resolver.ResolveIPFS(whatIs.Schema.Cid)
			fmt.Println(chalk.Green, "Definition:", definition)
		},
	}
	return
}
