package schema

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/client"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

// Method to get a schema
// Command Example: speedway schema get
func bootstrapQuerySchemaCommand(ctx context.Context, logger *golog.Logger) (querySchemaCmd *cobra.Command) {
	querySchemaCmd = &cobra.Command{
		Use:   "get",
		Short: "Query functionality for schemas",
		Args:  cobra.ExactArgs(1),
	}

	querySchemaCmd.AddCommand(bootstrapQuerySchemabyCreatorCommand(ctx, logger))
	querySchemaCmd.AddCommand(bootstrapQuerySchemaById(ctx, logger))

	return
}

func bootstrapQuerySchemaById(ctx context.Context, logger *golog.Logger) (querySchemaByIdCmd *cobra.Command) {
	querySchemaByIdCmd = &cobra.Command{
		Use:   "id [did]",
		Short: "Use: Returns a schema by the provided DID",
		Long:  "Returns a schema matching the did, if not provided the cli will prompt",
		Run: func(cmd *cobra.Command, args []string) {
			var did string
			if len(args) > 0 {
				did = args[0]
			}

			// get schema
			for did == "" {
				did = (&prompter.Prompter{
					Message: "Enter DID",
				}).Prompt()
				did = strings.Trim(did, " ")

				if did == "" {
					logger.Info(status.Info, "DID is required")
				}
			}

			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf("RPC Client Error: ", err.Error())
				return
			}

			session, err := cli.GetSessionInfo()
			if err != nil {
				logger.Fatalf(status.Error("SessionInfo Error: "), err)
				return
			}

			// query schema
			querySchemaRes, err := cli.GetSchemaByDid(rtmv1.QueryWhatIsRequest{
				Did:     did,
			})
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			defStr, _ := utils.MarshalJsonFmt(querySchemaRes.Schema)
			logger.Info(status.Debug, "Schema:", defStr)
		},
	}

	return
}

func bootstrapQuerySchemabyCreatorCommand(ctx context.Context, logger *golog.Logger) (querySchemaByCreatorCmd *cobra.Command) {
	querySchemaByCreatorCmd = &cobra.Command{
		Use:   "all",
		Short: "Use: retrieves all Schemas for user",
		Run: func(cmd *cobra.Command, args []string) {
			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			session, err := cli.GetSessionInfo()
			if err != nil {
				logger.Fatalf(status.Error("SessionInfo Error: "), err)
				return
			}

			logger.Infof("Querying Schemas for creator %s", session.Info.Address)
			res, err := cli.GetSchemaByCreator(rtmv1.QueryWhatIsByCreatorRequest{
				Creator: session.Info.Address,
			})

			if err != nil {
				logger.Fatalf("error while querying where is by creator %s: %s", session.Info.Address, err)
			}

			for _, wi := range res.WhatIs {
				b, _ := json.MarshalIndent(wi, "", "\t")
				fmt.Println(string(b))
			}
		},
	}

	return
}
