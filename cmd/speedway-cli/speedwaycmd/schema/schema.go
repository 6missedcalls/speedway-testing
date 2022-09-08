package schema

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

func BootstrapSchemaCommand(ctx context.Context, logger *golog.Logger) (schemaCmd *cobra.Command) {
	schemaCmd = &cobra.Command{
		Use:   "schema [subcommand]",
		Short: "Provides commands for managing schemas on the Sonr Network",
		Long: `Provides commands for managing schemas on the Sonr Network.
		You can create a new schema with the 'build' subcommand.
		You can query an existing schema with the 'query' subcommand.`,
		Run: func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Schemas] ")
	schemaCmd.AddCommand(bootstrapCreateSchemaCommand(ctx, logger))
	schemaCmd.AddCommand(bootstrapQuerySchemaCommand(ctx, logger))
	return
}
