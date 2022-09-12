package bucket

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/kataras/golog"
	"github.com/sonr-io/sonr/pkg/did"
	mtv1 "github.com/sonr-io/sonr/third_party/types/motor"
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
	queryBucketByCreatorCmd.AddCommand(bootstrapQueryBucketByIdCommand(ctx, logger))
	return
}

func bootstrapQueryBucketbyCreatorCommand(ctx context.Context, logger *golog.Logger) (queryBucketByCreatorCmd *cobra.Command) {
	queryBucketByCreatorCmd = &cobra.Command{
		Use:   "all",
		Short: "Retrieves all buckets for user",
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

			logger.Infof("Querying buckets for creator %s", m.GetAddress())
			res, err := m.QueryWhereIsByCreator(mtv1.QueryWhereIsByCreatorRequest{
				Creator: m.GetAddress(),
			})

			if err != nil {
				logger.Fatalf("error while querying where is by creator %s: %s", m.GetAddress(), err)
			}

			for _, wi := range res.WhereIs {
				b, _ := json.MarshalIndent(wi, "", "\t")
				fmt.Println(string(b))
			}
		},
	}

	return
}

func bootstrapQueryBucketByIdCommand(ctx context.Context, logger *golog.Logger) (queryBucketByCreatorCmd *cobra.Command) {
	queryBucketByCreatorCmd = &cobra.Command{
		Use:   "id",
		Short: "Retrieves a bucket based on its id (did)",
		Long:  "",
		Args:  cobra.ExactArgs(1),
		Run: func(cmd *cobra.Command, args []string) {
			if len(args) < 1 {
				logger.Fatal("must provide a did")
				return
			}

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

			didStr := args[0]
			_, err = did.ParseDID(didStr)
			if err != nil {
				logger.Fatal("invalid did")
			}

			logger.Info("Attempting to resolve bucket with did: %s", didStr)
			res, err := m.QueryWhereIs(mtv1.QueryWhereIsRequest{
				Creator: m.GetAddress(),
				Did:     didStr,
			})

			if err != nil {
				logger.Fatalf("error while querying where is with did %s: %s", didStr, err)
			}

			logger.Debugf("response returned with status: %d", res.Code)

			b, _ := json.MarshalIndent(res.WhereIs, "", "\t")
			fmt.Println(string(b))
		},
	}

	return
}
