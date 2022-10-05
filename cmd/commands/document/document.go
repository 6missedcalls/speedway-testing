package document

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

// Base command for the schema subcommands
// Command Example: speedway schema [subcommand]
func BootstrapDocumentCommand(ctx context.Context, logger *golog.Logger) (documentCmd *cobra.Command) {
	documentCmd = &cobra.Command{
		Use:   "document [subcommand]",
		Short: "Provides commands for managing documents uploaded to the Sonr content storage",
		Long: `Provides commands for managing schemas on the Sonr Network.
		Create a new schema with the 'build' subcommand.
		Get an existing schema with the 'get' subcommandd.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Documents] ")
	documentCmd.AddCommand(bootstrapBuildDocumentCommand(ctx, logger))
	documentCmd.AddCommand(bootstrapGetDocumentCommand(ctx, logger))
	return
}
