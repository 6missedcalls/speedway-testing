package daemon

import (
	"context"

	"github.com/kataras/golog"
	"github.com/spf13/cobra"
)

func BootstrapDaemonCommand(ctx context.Context, logger *golog.Logger) (daemonCmd *cobra.Command) {
	daemonCmd = &cobra.Command{
		Use:   "daemon [command]",
		Short: "Commands for daemons to interact with.",
		Run:   func(cmd *cobra.Command, args []string) {},
	}

	logger = logger.Child("[Daemon] ")

	daemonCmd.AddCommand(bootstrapStartDaemonCommand(ctx, logger))

	return
}
