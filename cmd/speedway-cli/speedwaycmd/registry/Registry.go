package registry

import (
	"context"

	"github.com/spf13/cobra"
)

func BootstrapRegistryCommand(ctx context.Context) (registryCmd *cobra.Command) {
	registryCmd = &cobra.Command{
		Use:   "registry",
		Short: "Provides commands for managing your account on the Sonr Network",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	registryCmd.AddCommand(bootstrapCreateAccountCommand(ctx))
	registryCmd.AddCommand(bootstrapLoginCommand(ctx))
	return
}
