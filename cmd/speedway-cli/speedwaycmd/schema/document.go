package schema

import (
	"context"
	"fmt"

	"github.com/kataras/golog"
	"github.com/sonr-io/sonr/pkg/did"
	mt "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapBuildSchemaDocumentCommand(ctx context.Context, logger *golog.Logger) (buildDocCmd *cobra.Command) {
	buildDocCmd = &cobra.Command{
		Use:   "build [did]",
		Short: "Create a new Schema Document associated to a Schema",
		Long:  "Creates a new Schema Document associated to a given schema",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.CreateInstance()

			loginResult, err := m.Instance.Login(loginRequest)
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

			did, err := did.ParseDID(args[0])

			if err != nil {
				logger.Errorf("Error while validating did: %s", err)
			}

			res, err := m.Instance.QueryWhatIs(mt.QueryWhatIsRequest{
				Creator: m.Instance.GetAddress(),
				Did:     did.String(),
			})

			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}

			var fields []*types.SchemaDocumentValue
			if file, err := cmd.Flags().GetString("file"); err == nil && file != "" {
				fields, err = utils.LoadDocumentFieldsFromDisk(file)
				if err != nil {
					logger.Fatalf("Error while loading document fields: %s", err)
					return
				}
			}

			uploadRes, err := m.Instance.UploadDocument(mt.UploadDocumentRequest{
				Creator:    m.Instance.GetAddress(),
				Label:      "test",
				Definition: res.Schema,
				Fields:     fields,
			})

			if err != nil {
				fmt.Printf("Error while uploading document: %s", err)
				return
			}

			fmt.Printf("Upload Successful")
			fmt.Printf("Document CID: %s", uploadRes.Cid)
		},
	}
	buildDocCmd.PersistentFlags().String("file", "", "File Path to  Document Fields")
	return
}
