package schema

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

func BootstrapSchemaCommand(ctx context.Context, logger *golog.Logger) (schemaCmd *cobra.Command) {
	schemaCmd = &cobra.Command{
		Use:   "schema",
		Short: "Provides commands for managing schemas on the Sonr Network",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	logger = logger.Child("[Schemas] ")
	schemaCmd.AddCommand(bootstrapCreateSchemaCommand(ctx, logger))
	schemaCmd.AddCommand(bootstrapQuerySchemaCommand(ctx, logger))
	return
}
