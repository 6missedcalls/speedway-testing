package registry

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

func BootstrapRegistryCommand(ctx context.Context, logger *golog.Logger) (registryCmd *cobra.Command) {
	registryCmd = &cobra.Command{
		Use:   "account",
		Short: "Provides commands for managing your account on the Sonr Network",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Registry] ")
	registryCmd.AddCommand(bootstrapCreateAccountCommand(ctx, logger))
	registryCmd.AddCommand(bootstrapLoginCommand(ctx, logger))
	return
}
