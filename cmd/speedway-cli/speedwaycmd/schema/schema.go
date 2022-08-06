package speedwayschema

import (
	"context"

	"github.com/spf13/cobra"
)

func BootstrapSchemaCommand(ctx context.Context) (schemaCmd *cobra.Command) {
	schemaCmd = &cobra.Command{
		Use:   "schema",
		Short: "Provides commands for managing registries on the Sonr network",
		Run:   func(cmd *cobra.Command, args []string) {},
	}
	schemaCmd.AddCommand(bootstrapCreateSchemaCommand(ctx))
	schemaCmd.PersistentFlags().StringP("did", "", "", "Your DID")
	schemaCmd.PersistentFlags().StringP("password", "p", "", "Your Vault Password")
	return
}
