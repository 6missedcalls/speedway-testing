package schema

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

// Base command for the schema subcommands
// Command Example: speedway schema [subcommand]
func BootstrapSchemaCommand(ctx context.Context, logger *golog.Logger) (schemaCmd *cobra.Command) {
	schemaCmd = &cobra.Command{
		Use:   "schema [subcommand]",
		Short: "Provides commands for managing schemas on the Sonr Network",
		Long: `Provides commands for managing schemas on the Sonr Network.
		Create a new schema with the 'build' subcommand.
		Get an existing schema with the 'get' subcommand.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Schemas] ")
	schemaCmd.AddCommand(bootstrapBuildSchemaDocumentCommand(ctx, logger))
	schemaCmd.AddCommand(bootstrapCreateSchemaCommand(ctx, logger))
	schemaCmd.AddCommand(bootstrapQuerySchemaCommand(ctx, logger))
	return
}
