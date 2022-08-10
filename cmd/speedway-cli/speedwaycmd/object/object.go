package object

import (
	"context"

	"github.com/spf13/cobra"
)

func BootstrapObjectCommand(ctx context.Context) (objectCmd *cobra.Command) {
	objectCmd = &cobra.Command{
		Use:   "object",
		Short: "Provides commands for managing objects on the Sonr network",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	objectCmd.AddCommand(BootstrapBuildObjectCommand(ctx))
	return
}
