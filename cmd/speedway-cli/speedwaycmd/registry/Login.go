package registry

import (
	"context"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/spf13/cobra"
)

func bootstrapLoginCommand(ctx context.Context, logger *golog.Logger) (loginCmd *cobra.Command) {
	loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Login to an existing account on the Sonr Network.",
		Long: `Login to an existing account on the Sonr Network.
		You will be prompted to enter your password to decrypt your vault.
		You may be also be prompted to enter your computer password to allow Speedway to access a keypair for you.`,
		Run: func(cmd *cobra.Command, args []string) {
			prompt := promptui.Prompt{
				Label: "Enter your Address",
			}
			addr, err := prompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			prompt = promptui.Prompt{
				Label: "Enter your Password",
			}
			password, err := prompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			pskKey, err := storage.Load("psk")
			if pskKey.Data == nil || len(pskKey.Data) != 32 {
				logger.Fatalf(status.Warning("Please add this device to your current account or make another account"))
				return
			}
			req := rtmv1.LoginRequest{
				Did:       addr,
				Password:  password,
				AesPskKey: pskKey.Data,
			}
			if err != nil {
				logger.Fatalf(status.Error("LoginRequest Error: "), err)
			}
			m := binding.CreateInstance()
			res, err := m.Login(req)
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
