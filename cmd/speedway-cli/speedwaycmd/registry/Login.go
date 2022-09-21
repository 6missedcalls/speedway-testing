package registry

import (
	"context"
	"regexp"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/client"
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
			addr := (&prompter.Prompter{
				Message: "Enter the address of the registry you wish to login to",
			}).Prompt()

			password := (&prompter.Prompter{
				Message: "Enter your password",
				Regexp:  regexp.MustCompile(`.{8,}`),
				NoEcho:  true,
			}).Prompt()

			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			res, err := cli.Login(rtmv1.LoginRequest{
				Did:      addr,
				Password: password,
			})
			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}

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
