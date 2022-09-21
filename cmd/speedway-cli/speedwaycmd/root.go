package speedwaycmd

import (
	"context"

	"github.com/kataras/golog"
	bucket "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/bucket"
	daemon "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/daemon"
	object "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/object"
	registry "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/registry"
	schema "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/schema"
	prompts "github.com/sonr-io/speedway/internal/prompts"
	"github.com/spf13/cobra"
)

func Execute(logger *golog.Logger) error {
	return bootstrapRootCommand(context.Background(), logger).Execute()
}

func bootstrapRootCommand(ctx context.Context, logger *golog.Logger) (rootCmd *cobra.Command) {
	rootCmd = &cobra.Command{
		Use:   "speedway",
		Short: "The Sonr Speedway CLI tool",
		Long: prompts.SplashScreen() + `
		Manage your account, create and manage your schemas, objects and buckets.
		For more information, visit https://docs.sonr.io/.`,
	}

	ctx = context.WithValue(ctx, "DAEMON_PORT", 6868)

	rootCmd.AddCommand(registry.BootstrapRegistryCommand(ctx, logger))
	rootCmd.AddCommand(schema.BootstrapSchemaCommand(ctx, logger))
	rootCmd.AddCommand(object.BootstrapObjectCommand(ctx, logger))
	rootCmd.AddCommand(bucket.BootstrapBucketCommand(ctx, logger))
	rootCmd.AddCommand(daemon.BootstrapDaemonCommand(ctx, logger))
	rootCmd.AddCommand(BootstrapServeCommand(ctx))

	return
}
