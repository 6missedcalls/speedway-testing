package daemon

import (
	"context"
	"fmt"
	"strconv"

	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/internal/daemon"
	"github.com/spf13/cobra"
)

func bootstrapStartDaemonCommand(ctx context.Context, logger *golog.Logger) (startCmd *cobra.Command) {
	startCmd = &cobra.Command{
		Use:   "start [port]",
		Short: "Starts the Speedway daemon.",
		Long: `Sets up a GRPC server daemon which contains a local Motor instance.
		This daemon allows the user to stay logged in between speedway sessions.`,
		Run: func(cmd *cobra.Command, args []string) {
			var port int64
			if len(args) < 1 {
				port = 6868
			} else {
				p, err := strconv.ParseInt(args[0], 10, 64)
				if err != nil {
					fmt.Printf("Error parsing port: %s", err)
					return
				}
				port = p
			}
			fmt.Println(daemon.Start(int(port)))
		},
	}
	return
}
