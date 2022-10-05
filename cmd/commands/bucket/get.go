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

			res, err := cli.GetBucketsByCreator(rtmv1.QueryWhereIsByCreatorRequest{
				Creator: session.Info.Address,
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

			didStr := args[0]
			_, err := did.ParseDID(didStr)
			if err != nil {
				logger.Fatal("invalid did")
			}

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

			logger.Info("Attempting to resolve bucket with did: %s", didStr)
			res, err := cli.GetBucketById(rtmv1.QueryWhereIsRequest{
				Creator: session.Info.Address,
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
