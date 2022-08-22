package object

import (
	"context"

	"github.com/spf13/cobra"
)

func BootstrapObjectCommand(ctx context.Context) (objectCmd *cobra.Command) {
	objectCmd = &cobra.Command{
		Use:   "object",
		Short: "Provides commands for managing objects on the Sonr Network",
		Long: `Build and Get objects on the Sonr Network. 
		Build an object for an existing schema and upload it to the network.
		Get an existing object from the network.
		For more information, visit https://docs.sonr.io/.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	objectCmd.AddCommand(BootstrapBuildObjectCommand(ctx))
	objectCmd.AddCommand(BootstrapGetObjectCommand(ctx))
	return
}
