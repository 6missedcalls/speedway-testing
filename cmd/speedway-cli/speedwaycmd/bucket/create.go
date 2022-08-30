package bucket

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapCreateBucketCommand(ctx context.Context, logger *golog.Logger) (createBucketCmd *cobra.Command) {
	createBucketCmd = &cobra.Command{
		Use:   "create",
		Short: "Use: create",
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

			logger.Info(status.Info, "Creating Bucket")
			schemaPrompt := promptui.Prompt{
				Label: "Enter a Label",
			}
			bucketLabel, err := schemaPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// prompt for an owner (this can overwrite the Creator address)
			// TODO: This is a short term solution until logging in from other devices works
			creatorPrompt := promptui.Prompt{
				Label:   "Enter an Owner address",
				Default: loginRequest.Did,
			}
			creator, err := creatorPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			req := rtmv1.CreateBucketRequest{
				Creator: creator,
				Label:   bucketLabel,
			}
			visibilityPrompt := promptui.Select{
				Label: "Bucket Visibility",
				Items: []string{
					"public",
					"private",
				},
				Size: 2,
			}
			_, visibility, err := visibilityPrompt.Run()
			if err != nil {
				return
			}

			req.Visibility, err = utils.ConvertBucketVisibility(visibility)
			if err != nil {
				return
			}
			rolePrompt := promptui.Select{
				Label: "Bucket Visibility",
				Items: []string{
					"application",
					"user",
				},
				Size: 2,
			}
			_, role, err := rolePrompt.Run()
			if err != nil {
				return
			}

			req.Role = ConvertRole(role)

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
			fmt.Print(string(b))
		},
	}

	return
}
