package bucket

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/kataras/golog"
	"github.com/sonr-io/sonr/pkg/did"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
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
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf("Login Error: ", err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatal(status.Error("Login Failed"))
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

			b, err := m.GetBucket(bucketDidStr)
			if err != nil {
				logger.Fatalf("Error while getting bucket: %s", err)
				return
			}
			cnt, err := b.ResolveContentBySchema(schemaDidStr)
			for _, c := range cnt {
				itemBytes, _ := json.MarshalIndent(c, "", "\t")
				fmt.Println(string(itemBytes))
				itemCnt := make(map[string]interface{})
				err = json.Unmarshal(c.Item, &itemCnt)
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
