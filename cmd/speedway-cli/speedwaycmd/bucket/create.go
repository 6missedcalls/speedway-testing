package bucket

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"
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

			logger.Info(status.Info, "Creating Bucket", status.Reset)
			bucketLabel := (&prompter.Prompter{
				Message: "Bucket Label: ",
			}).Prompt()
			if bucketLabel == "" {
				logger.Fatal(status.Error("Bucket Label cannot be empty"))
				return
			}

			// prompt for an owner (this can overwrite the Creator address)
			// TODO: This is a short term solution until logging in from other devices works
			creator := (&prompter.Prompter{
				Message: "Creator Address:",
			}).Prompt()
			if creator == "" {
				logger.Info(status.Info, "Using default creator address", status.Reset)
				creator = m.GetDID().String()
			}

			req := rtmv1.CreateBucketRequest{
				Creator: creator,
				Label:   bucketLabel,
			}

			visibility := (&prompter.Prompter{
				Choices:    []string{"public", "private"},
				Default:    "public",
				Message:    "Please select visibility for the bucket: ",
				IgnoreCase: true,
			}).Prompt()

			req.Visibility, err = utils.ConvertBucketVisibility(visibility)
			if err != nil {
				return
			}

			role := (&prompter.Prompter{
				Choices:    []string{"application", "user"},
				Default:    "application",
				Message:    "Please select visibility for the bucket: ",
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
			resp, err := m.CreateBucket(ctx, req)
			if err != nil {
				logger.Fatal("error while creating bucket: ", err)
				return
			}
			logger.Info("Bucket created")
			wiResp, err := m.QueryWhereIs(rtmv1.QueryWhereIsRequest{
				Creator: m.GetAddress(),
				Did:     resp.GetDID(),
			})
			b, err := json.MarshalIndent(wiResp, "", "\t")
			fmt.Print(status.Success(string(b)))
		},
	}

	return
}
