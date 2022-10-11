package document

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/kataras/golog"
	mt "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/client"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapGetDocumentCommand(ctx context.Context, logger *golog.Logger) (getDocCmd *cobra.Command) {
	getDocCmd = &cobra.Command{
		Use:   "get [cid]",
		Short: "",
		Long:  "",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			cid := args[0]

			cli, err := client.New(ctx)

			if err != nil {
				logger.Fatalf("Error while creating RPC client ... aborting: %s", err)
				return
			}

			res, err := cli.GetDocument(mt.GetDocumentRequest{
				Cid: cid,
			})

			if err != nil {
				logger.Fatalf("Error while retrieving document from storage: %s", err)
				return
			}

			// !Changed from res.Did
			fmt.Printf("Schema did: %s \n", res.Document.SchemaDid)
			jsonRep := make(map[string]interface{})
			docBytes := []byte(res.Document.String())
			json.Unmarshal(docBytes, &jsonRep)
			serialized, err := utils.MarshalJsonFmt(res.Document)

			if err != nil {
				logger.Fatalf("error while formatting json", err)
			}
			logger.Println(serialized)

			if file, err := cmd.Flags().GetString("output"); err == nil && file != "" {
				utils.SaveTo(res.Cid, file, []byte(serialized))
			}
		},
	}

	getDocCmd.PersistentFlags().String("output", "", "Absolute path to a directory to save the resolved data")

	return
}
