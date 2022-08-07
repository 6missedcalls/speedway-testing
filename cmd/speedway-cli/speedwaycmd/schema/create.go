package schema

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/manifoldco/promptui"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func loadKey(name string) ([]byte, error) {
	var file *os.File
	if _, err := os.Stat(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/keys/"+name)); err != nil {
		if os.IsNotExist(err) {
			return nil, err
		}
		return nil, err
	}
	file, err := os.Open(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/keys/"+name))
	if err != nil {
		return nil, err
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	return data, err
}

func bootstrapCreateSchemaCommand(ctx context.Context) (createSchemaCmd *cobra.Command) {
	createSchemaCmd = &cobra.Command{
		Use:   "create",
		Short: "Use: create",

		Run: func(cmd *cobra.Command, args []string) {
			prompt := promptui.Prompt{
				Label: "Enter your DID",
			}
			did, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			aesKey, err := loadKey("AES.key")
			if aesKey == nil || len(aesKey) != 32 {
				fmt.Println("Please provide a valid pskKey")
			}
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			pskKey, err := loadKey("PSK.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println("Please provide a valid pskKey")
			}
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			loginRequest := rtmv1.LoginRequest{
				Did:       did,
				AesDscKey: aesKey,
				AesPskKey: pskKey,
			}
			m := mtr.EmptyMotor("Speedway_Node")
			loginResult, err := m.Login(loginRequest)
			if loginResult.Success {
				fmt.Println("Login success")
			} else {
				fmt.Println("Login failed")
				fmt.Println(err)
			}
			fmt.Println("Creating schema...")
			schemaPrompt := promptui.Prompt{
				Label: "Enter the Schema Label",
			}
			schemaLabel, err := schemaPrompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			prompt = promptui.Prompt{
				Label: "Enter your Schema Fields",
			}
			schemaFields, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			// for every schemaFields, prompt for the type of the field
			selectSchemaKind := promptui.Select{
				Label: "Select a Schema Field",
				Items: []string{
					"MAP",
					"LIST",
					"UNIT",
					"BOOL",
					"INT",
					"FLOAT",
					"STRING",
					"BYTES",
					"LINK",
					"STRUCT",
					"UNION",
					"ENUM",
					"ANY",
				},
			}
			_, result, err := selectSchemaKind.Run()

			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}

			schemaKind := rtmv1.CreateSchemaRequest_SCHEMA_KIND_ANY
			switch result {
			case "ANY":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_ANY
			case "MAP":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_MAP
			case "LIST":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_LIST
			case "UNIT":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_UNIT
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
			case "STRUCT":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_STRUCT
			case "UNION":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_UNION
			case "ENUM":
				schemaKind = rtmv1.CreateSchemaRequest_SCHEMA_KIND_ENUM
			}
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			createSchemaRequest := rtmv1.CreateSchemaRequest{
				Label: schemaLabel,
				Fields: map[string]rtmv1.CreateSchemaRequest_SchemaKind{
					schemaFields: schemaKind,
				},
			}
			fmt.Println("Schema request: ", createSchemaRequest)
			createSchemaResult, err := m.CreateSchema(createSchemaRequest)
			if err != nil {
				fmt.Println("Create schema err: ", err)
			}
			fmt.Println(createSchemaResult)
		},
	}
	return
}
