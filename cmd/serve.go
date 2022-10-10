package cmd

import (
	"context"
	"embed"
	"fmt"
	"os"

	"github.com/sonr-io/speedway/internal/binding"
	sws "github.com/sonr-io/speedway/server/routes"
	"github.com/spf13/cobra"
)

const (
	PORT = 4040
	ADDR = "127.0.0.1"
)

func BootstrapServeCommand(ctx context.Context, buildDir embed.FS) (serveCmd *cobra.Command) {
	serveCmd = &cobra.Command{
		Use:   "serve",
		Short: "Use: Serves web application on localhost",
		Run: func(cmd *cobra.Command, args []string) {
			os.Setenv("SONR_RPC_ADDR_PUBLIC", "137.184.190.146:9090")
			os.Setenv("GIN_MODE", "release")

			var port = PORT
			if p, err := cmd.Flags().GetInt("port"); err != nil && p != -1 {
				port = p
			}

			server, err := sws.New(func(options *sws.ServerConfig) {
				options.Address = fmt.Sprintf("127.0.0.1:%d", port)
				options.EmbedFs = &buildDir
				options.StaticDir = "out"
				options.Binding = binding.CreateInstance()
			})
			if err != nil {
				fmt.Print(fmt.Errorf("Error while configuring speedway: %s", err))
			}

			server.ConfigureRoutes()
			server.Serve(true)
		},
	}

	serveCmd.PersistentFlags().Int("port", 4040, "override the default port (4040)")

	return
}
