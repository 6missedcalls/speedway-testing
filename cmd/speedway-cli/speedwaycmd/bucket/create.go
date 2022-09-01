package bucket

import (
	"context"
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
			req := rtmv1.CreateBucketRequest{
				Label: bucketLabel,
			}
			req.Creator = loginRequest.Did
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

			req.Role, err = utils.ConvertBucketRole(role)
			if err != nil {
				return
			}
			logger.Info("Creating bucket with label: ", bucketLabel)

			res, err := m.CreateBucket(ctx, req)
			if err != nil {
				logger.Fatal("create bucket error: ", err)
				return
			}

			serv := res.CreateBucketServiceEndpoint()

			logger.Info("Bucket created: uri: ", serv.ID)
		},
	}

	return
}