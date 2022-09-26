package registry

import (
	"context"

	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/internal/client"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/spf13/cobra"
)

// Method to login to an existing account
// Command Example: speedway account login
func bootstrapLoginCommand(ctx context.Context, logger *golog.Logger) (loginCmd *cobra.Command) {
	loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Login to an existing account on the Sonr Network.",
		Long: `Login to an existing account on the Sonr Network.
		You will be prompted to enter your password to decrypt your vault.
		You may be also be prompted to enter your computer password to allow Speedway to access a keypair for you.`,
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			res, err := cli.Login(loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}
			logger.Info(status.Debug, "Login Response: ", res)

			if res.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatalf(status.Error("Login failed"))
				return
			}
		},
	}
	return
}
