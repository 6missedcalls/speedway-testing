package bucket

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/client"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapCreateBucketCommand(ctx context.Context, logger *golog.Logger) (createBucketCmd *cobra.Command) {
	createBucketCmd = &cobra.Command{
		Use:   "create",
		Short: "Create a new bucket on the Sonr Network.",
		Long:  `Create a new bucket on the Sonr Network.`,
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

			logger.Info(status.Info, "Creating Bucket", status.Reset)
			bucketLabel := (&prompter.Prompter{
				Message: "Bucket Label",
			}).Prompt()
			if bucketLabel == "" {
				logger.Fatal(status.Error("Bucket Label cannot be empty"))
				return
			}

			// prompt for an owner (this can overwrite the Creator address)
			// TODO: This is a short term solution until logging in from other devices works
			creator := (&prompter.Prompter{
				Message: "Creator Address",
				Default: session.Info.Address,
			}).Prompt()
			if creator == "" {
				logger.Info(status.Info, "Using default creator address", status.Reset)
				creator = session.Info.Address
			}

			req := rtmv1.CreateBucketRequest{
				Creator: creator,
				Label:   bucketLabel,
			}

			visibilityString := (&prompter.Prompter{
				Choices:    []string{"public", "private"},
				Default:    "public",
				Message:    "Please select visibility for the bucket",
				IgnoreCase: true,
			}).Prompt()

			visibility, err := utils.ConvertBucketVisibility(visibilityString)
			if err != nil {
				return
			}
			req.Visibility = visibility

			role := (&prompter.Prompter{
				Choices:    []string{"application", "user"},
				Default:    "application",
				Message:    "Please select visibility for the bucket",
				IgnoreCase: true,
			}).Prompt()

			req.Role, err = utils.ConvertBucketRole(role)

			if err != nil {
				logger.Fatalf("Error while assinging bucket role: %s", err)
			}

			items := prompts.BucketContentPrompt(logger)
			req.Content = items

			logger.Info("Creating bucket with label: ", bucketLabel)
			logger.Info("Creating bucket with role: ", role)
			logger.Info("Creating bucket with visibility: ", visibility)
			resp, err := cli.CreateBucket(req)
			if err != nil {
				logger.Fatal("error while creating bucket: ", err)
				return
			}
			logger.Info("Bucket created")
			wiResp, err := cli.GetBucketById(rtmv1.QueryWhereIsRequest{
				Creator: session.Info.Address,
				Did:     resp.GetDid(),
			})

			b, err := json.MarshalIndent(wiResp, "", "\t")
			fmt.Print(status.Success(string(b)))
		},
	}

	return
}
