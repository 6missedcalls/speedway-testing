package registry

import (
	"context"
	"errors"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

// Method to create a new account
// Command Example: speedway account create
func bootstrapCreateAccountCommand(ctx context.Context, logger *golog.Logger) (createCmd *cobra.Command) {
	createCmd = &cobra.Command{
		Use:   "create",
		Short: "Creates a new account on the Sonr Network.",
		Long: `Creates a new account on the Sonr Network.
		Use: speedway account create
		There is a prompt to enter a password to encrypt your vault.
		There is a prompt to enter your computer password to allow Speedway to create a new keypair for you. (Please do not delete this keypair from your keychain.)`,
		Run: func(cmd *cobra.Command, args []string) {
			validate := func(input string) error {
				if len(input) < 8 {
					return errors.New("password must be at least 8 characters")
				}
				return nil
			}
			prompt := promptui.Prompt{
				Label:    "Password",
				Mask:     '*',
				Validate: validate,
			}
			password, err := prompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			req := rtmv1.CreateAccountRequest{
				Password: password,
			}
			logger.Info(status.Debug, "Create Account Request: ", req)
			if err != nil {
				logger.Fatalf(status.Error("Error: %s"), err)
			}
			m := binding.InitMotor()
			res, err := utils.CreateAccount(m, req)
			if err != nil {
				logger.Fatalf(status.Error("CreateAccount Error: "), err)
				return
			}

			logger.Info(status.Debug, "Create Account Response: ", res)
			logger.Info(status.Info, "Account Address: ", res.Address)
		},
	}
	return
}
