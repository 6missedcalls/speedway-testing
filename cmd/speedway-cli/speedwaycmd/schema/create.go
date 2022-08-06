package speedwayschema

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

// create a struct to hold the command line flags for the command
type CreateSchemaFlags struct {
	Did      string
	Password string

	// Schema Flags
	SchemaLabel       string
	SchemaFieldsNames map[string]string
	SchemaFields      map[string]string
}

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
		Short: "Use: createSchema -did <did> -password <password> -schemaLabel <schemaLabel> -schemaFields <schemaFields>",

		Run: func(cmd *cobra.Command, args []string) {
			did, _ := cmd.Flags().GetString("did")
			password, _ := cmd.Flags().GetString("password")
			if len(args) < 1 {
				fmt.Println("Please provide a schema name")
				return
			}
			schemaLabel, _ := cmd.Flags().GetString("schemaLabel")
			schemaNames, _ := cmd.Flags().GetStringSlice("SchemaFieldsNames")
			fields, _ := cmd.Flags().GetStringSlice("schemaFields")
			// combine schema names and fields into a map
			schemaFields := make(map[string]string)
			for i := 0; i < len(schemaNames); i++ {
				schemaFields[schemaNames[i]] = fields[i]
			}
			fmt.Print("schemaFields", schemaFields)
			if did == "" || password == "" || schemaLabel == "" || len(schemaFields) == 0 {
				fmt.Println("Please provide a did, password, schemaLabel and schemaFields")
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
			}
			fmt.Println("Creating schema...")
			schemaReq := rtmv1.CreateSchemaRequest{
				Label: schemaLabel,
				Fields: map[string]rtmv1.CreateSchemaRequest_SchemaKind{
					"helloWorld": rtmv1.CreateSchemaRequest_SCHEMA_KIND_STRING,
				},
			}
			schemaRes, err := m.CreateSchema(schemaReq)
			if err != nil {
				fmt.Println("Create schema failed:", err)
			}
			fmt.Println("Schema created:", schemaRes)
		},
	}
	createSchemaCmd.Flags().StringP("did", "d", "", "did")
	createSchemaCmd.Flags().StringP("password", "p", "", "password")
	return
}
