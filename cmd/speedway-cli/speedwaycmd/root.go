package speedwaycmd

import (
	"context"

	object "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/object"
	registry "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/registry"
	schema "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/schema"
	"github.com/spf13/cobra"
)

func Execute() error {
	return bootstrapRootCommand(context.Background()).Execute()
}

func bootstrapRootCommand(ctx context.Context) (rootCmd *cobra.Command) {
	rootCmd = &cobra.Command{
		Use:   "speedway",
		Short: "The Sonr Speedway CLI tool",
		Long:  `Manage your speedway services and blockchain registered types with the Sonr CLI tool.`,

		// Run: func(cmd *cobra.Command, args []string) {},
	}
	rootCmd.AddCommand(registry.BootstrapRegistryCommand(ctx))
	rootCmd.AddCommand(schema.BootstrapSchemaCommand(ctx))
	rootCmd.AddCommand(object.BootstrapObjectCommand(ctx))
	rootCmd.AddCommand(BootstrapServeCommand(ctx))

	return
}
