package registry

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

func BootstrapRegistryCommand(ctx context.Context, logger *golog.Logger) (registryCmd *cobra.Command) {
	registryCmd = &cobra.Command{
		Use:   "account [subcommand]",
		Short: "Provides commands for managing your account on the Sonr Network.",
		Long: `Provides commands for managing your account on the Sonr Network.
		You can create a new account or login to an existing account.
		Create a new account with the 'create' subcommand.
		Login to an existing account with the 'login' subcommand.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Registry] ")
	registryCmd.AddCommand(bootstrapCreateAccountCommand(ctx, logger))
	registryCmd.AddCommand(bootstrapLoginCommand(ctx, logger))
	return
}
