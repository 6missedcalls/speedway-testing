package bucket

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/kataras/golog"
	"github.com/sonr-io/sonr/pkg/did"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/client"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/spf13/cobra"
)

func bootstrapSearchCommand(ctx context.Context, logger *golog.Logger) (searchBucketByCreatorCmd *cobra.Command) {
	searchBucketByCreatorCmd = &cobra.Command{
		Use:   "search",
		Short: "Use: get",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	searchBucketByCreatorCmd.AddCommand(bootstrapSearchBySchemaIdCommand(ctx, logger))
	return
}

func bootstrapSearchBySchemaIdCommand(ctx context.Context, logger *golog.Logger) (searchBucketBySchemaIdCmd *cobra.Command) {
	searchBucketBySchemaIdCmd = &cobra.Command{
		Use:   "schema",
		Short: "Use: retrieves all buckets for user",
		Long:  "Queries contents of a bucket by a schema returns all content matching by schema did",
		Args:  cobra.ExactArgs(2),
		Run: func(cmd *cobra.Command, args []string) {
			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			session, err := cli.GetSessionInfo()

			if err != nil {
				logger.Fatalf("Error while getting current session info: %s", err)
				return
			}

			bucketDidStr := args[0]
			_, err = did.ParseDID(bucketDidStr)
			if err != nil {
				logger.Fatal("invalid did")
			}

			schemaDidStr := args[1]
			_, err = did.ParseDID(schemaDidStr)
			if err != nil {
				logger.Fatal("invalid did")
			}

			result, err := cli.SearchBucketBySchema(rtmv1.SeachBucketContentBySchemaRequest{
				Creator:   session.Info.Address,
				BucketDid: bucketDidStr,
				SchemaDid: schemaDidStr,
			})

			if err != nil {
				logger.Fatalf("Error while resolving content by schema did: %s \n %s", schemaDidStr, err)
			}

			for _, c := range result.Content {
				itemBytes, _ := json.MarshalIndent(c, "", "\t")
				fmt.Println(string(itemBytes))
				itemCnt := make(map[string]interface{})
				err = json.Unmarshal(c, &itemCnt)
				if err != nil {
					logger.Errorf("error while deserializing item resolved from search: %s", err)
					continue
				}

				fmt.Printf("content: %v", itemCnt)
			}

		},
	}

	return
}
