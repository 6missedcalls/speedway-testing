package cmd

import (
	"context"
	"embed"

	"github.com/kataras/golog"
	bucket "github.com/sonr-io/speedway/cmd/commands/bucket"
	daemon "github.com/sonr-io/speedway/cmd/commands/daemon"
	document "github.com/sonr-io/speedway/cmd/commands/document"
	registry "github.com/sonr-io/speedway/cmd/commands/registry"
	schema "github.com/sonr-io/speedway/cmd/commands/schema"
	prompts "github.com/sonr-io/speedway/internal/prompts"
	"github.com/spf13/cobra"
	cobracompletefig "github.com/withfig/autocomplete-tools/integrations/cobra"
)

func Execute(logger *golog.Logger, buildDir embed.FS) error {
	return bootstrapRootCommand(context.Background(), logger, buildDir).Execute()
}

func bootstrapRootCommand(ctx context.Context, logger *golog.Logger, buildDir embed.FS) (rootCmd *cobra.Command) {
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
	rootCmd.AddCommand(bucket.BootstrapBucketCommand(ctx, logger))
	rootCmd.AddCommand(daemon.BootstrapDaemonCommand(ctx, logger))
	rootCmd.AddCommand(BootstrapServeCommand(ctx, buildDir))
	rootCmd.AddCommand(cobracompletefig.CreateCompletionSpecCommand())
	rootCmd.AddCommand(document.BootstrapDocumentCommand(ctx, logger))
	return
}
