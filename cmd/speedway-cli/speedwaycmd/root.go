package speedwaycmd

import (
	"context"

	MotorRegistry "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/registry"
	SpeedwaySchema "github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd/schema"
	"github.com/spf13/cobra"
)

func Execute() error {
	return bootstrapRootCommand(context.Background()).Execute()
}

func bootstrapRootCommand(ctx context.Context) (rootCmd *cobra.Command) {
	rootCmd = &cobra.Command{
		Use:   "speedway",
		Short: "The Sonr Speedway CLI tool",
		Long:  `Manage your motor services and blockchain registered types with the Sonr CLI tool.`,

		// Run: func(cmd *cobra.Command, args []string) {},
	}
	rootCmd.AddCommand(MotorRegistry.BootstrapRegistryCommand(ctx))
	rootCmd.AddCommand(SpeedwaySchema.BootstrapSchemaCommand(ctx))
	return
}
