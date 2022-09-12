package object

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

// Base command for the object subcommands
// Command Example: speedway object [subcommand]
func BootstrapObjectCommand(ctx context.Context, logger *golog.Logger) (objectCmd *cobra.Command) {
	objectCmd = &cobra.Command{
		Use:   "object [subcommand]",
		Short: "Build and query objects on the Sonr Network.",
		Long: `Build and query objects on the Sonr Network.
		Create a new object with the 'build' subcommand.
		Query an existing object with the 'query' subcommand.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Objects] ")
	objectCmd.AddCommand(BootstrapBuildObjectCommand(ctx, logger))
	objectCmd.AddCommand(BootstrapGetObjectCommand(ctx, logger))
	return
}
