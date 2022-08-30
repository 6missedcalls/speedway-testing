package speedwaycmd

import (
	"context"
	"fmt"
	"os"

	sws "github.com/sonr-io/speedway/server/routes"
	"github.com/spf13/cobra"
)

const (
	PORT = 4040
	ADDR = "127.0.0.1"
)

func BootstrapServeCommand(ctx context.Context) (serveCmd *cobra.Command) {
	serveCmd = &cobra.Command{
		Use:   "serve",
		Short: "Use: Serves web application on localhost",
		Run: func(cmd *cobra.Command, args []string) {
			os.Setenv("SONR_RPC_ADDR_PUBLIC", "137.184.190.146:9090")
			os.Setenv("GIN_MODE", "release")
			cwd, _ := os.Getwd()

			var port = PORT
			if p, err := cmd.Flags().GetInt("port"); err != nil && p != -1 {
				port = p
			}

			server, err := sws.New(func(options *sws.ServerConfig) {
				options.Address = fmt.Sprintf("127.0.0.1:%d", port)
				options.StaticDir = fmt.Sprintf("%s/build", cwd)
			})
			if err != nil {
				fmt.Print(fmt.Errorf("Error while configuring speedway: %s", err))
			}

			server.ConfigureRoutes()
			server.Serve()
		},
	}

	serveCmd.PersistentFlags().Int("port", 4040, "override the default port (4040)")

	return
}
