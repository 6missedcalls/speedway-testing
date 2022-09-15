package registry

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

// Base command for the registry subcommands
// Command Example: speedway account [subcommand]
func BootstrapRegistryCommand(ctx context.Context, logger *golog.Logger) (registryCmd *cobra.Command) {
	registryCmd = &cobra.Command{
		Use:   "account [subcommand]",
		Short: "Provides commands for managing your account on the Sonr Network.",
		Long: `Provides commands for managing your account on the Sonr Network.
		Create a new account with the 'create' subcommand.
		Login to an existing account with the 'login' subcommand.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Registry] ")
	registryCmd.AddCommand(bootstrapCreateAccountCommand(ctx, logger))
	registryCmd.AddCommand(bootstrapLoginCommand(ctx, logger))
	registryCmd.AddCommand(bootstrapBuyAlias(ctx, logger))
	return
}
