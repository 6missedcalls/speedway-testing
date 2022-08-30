package bucket

import (
	"context"

	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapQueryCommand(ctx context.Context, logger *golog.Logger) (queryBucketByCreatorCmd *cobra.Command) {
	queryBucketByCreatorCmd = &cobra.Command{
		Use:   "get",
		Short: "Use: get",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	queryBucketByCreatorCmd.AddCommand(bootstrapQueryBucketbyCreatorCommand(ctx, logger))
	return
}

func bootstrapQueryBucketbyCreatorCommand(ctx context.Context, logger *golog.Logger) (queryBucketByCreatorCmd *cobra.Command) {
	queryBucketByCreatorCmd = &cobra.Command{
		Use:   "all",
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

			logger.Infof("Querying buckets for creator")
			res, err := m.GetBuckets(ctx)
			if err != nil {
				logger.Fatalf("Error while querying buckets for creator %s %s", m.GetAddress(), err)
			}
			logger.Debug("Bucket count for user: %d", len(res))
		},
	}

	return
}
