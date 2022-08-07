package speedwayschema

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

func loadKey(path string) ([]byte, error) {
	var file *os.File
	if _, err := os.Stat(path); err != nil {
		if os.IsNotExist(err) {
			return nil, err
		}
		return nil, err
	}
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	return data, nil
}

func bootstrapCreateSchemaCommand(ctx context.Context) (createSchemaCmd *cobra.Command) {
	createSchemaCmd = &cobra.Command{
		Use:   "createSchema",
		Short: "Use: createSchema -did <did> -password <password> -schemaLabel <schemaLabel>",

		Run: func(cmd *cobra.Command, args []string) {
			prompt := promptui.Prompt{
				Label: "Enter your DID",
			}
			did, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			prompt = promptui.Prompt{
				Label: "Enter your Password",
			}
			password, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			prompt = promptui.Prompt{
				Label: "Enter your Schema Label",
			}
			schemaLabel, err := prompt.Run()
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
			selectSchemaKind := promptui.Select{
				Label: "Select a Schema Field",
				Items: []string{
					"CreateSchemaRequest_SCHEMA_KIND_UNRECOGNIZED",
					"CreateSchemaRequest_SCHEMA_KIND_MAP",
					"CreateSchemaRequest_SCHEMA_KIND_LIST",
					"CreateSchemaRequest_SCHEMA_KIND_UNIT",
					"CreateSchemaRequest_SCHEMA_KIND_BOOL",
					"CreateSchemaRequest_SCHEMA_KIND_INT",
					"CreateSchemaRequest_SCHEMA_KIND_FLOAT",
					"CreateSchemaRequest_SCHEMA_KIND_STRING",
					"CreateSchemaRequest_SCHEMA_KIND_BYTES",
					"CreateSchemaRequest_SCHEMA_KIND_LINK",
					"CreateSchemaRequest_SCHEMA_KIND_STRUCT",
					"CreateSchemaRequest_SCHEMA_KIND_UNION",
					"CreateSchemaRequest_SCHEMA_KIND_ENUM",
					"CreateSchemaRequest_SCHEMA_KIND_ANY",
				},
			}
			_, result, err := selectSchemaKind.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			pskKey, err := loadKey("PSK.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println("Please provide a valid pskKey")
			}
			if err != nil {
				fmt.Println("reqBytes err", err)
			}
			req := rtmv1.LoginRequest{
				Did:       did,
				Password:  password,
				AesPskKey: pskKey,
			}
			m := mtr.EmptyMotor("Test_Node")
			res, err := m.Login(req)
			if res.Success {
				fmt.Println("Login success")
			} else {
				fmt.Println("Login failed")
				fmt.Println(err)
			}
			fmt.Println("Creating schema...")
			createSchemaRequest := rtmv1.CreateSchemaRequest{
				Label: "TestUser",
				Fields: map[string]rtmv1.CreateSchemaRequest_SchemaKind{
					schemaLabel: rtmv1.CreateSchemaRequest_SCHEMA_KIND_ANY,
				},
			}
			fmt.Println("Schema request: ", createSchemaRequest)
			res, err = m.CreateSchema(createSchemaRequest)
			if res.Success {
				fmt.Println("Schema created")
			} else {
				fmt.Println("Schema creation failed")
				fmt.Println(err)
			}
		},
	}
	return
}
