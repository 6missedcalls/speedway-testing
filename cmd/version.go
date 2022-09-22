package cmd

import (
	"context"
	"fmt"

	"github.com/spf13/cobra"
)

func BootstrapVersionCommand(ctx context.Context) (versionCmd *cobra.Command) {
	versionCmd = &cobra.Command{
		Use:   "version",
		Short: "Use: Prints the version of Speedway CLI",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Speedway CLI v0.1.0")
		},
	}
	return
}
