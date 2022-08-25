package registry

import (
	"context"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapLoginCommand(ctx context.Context, logger *golog.Logger) (loginCmd *cobra.Command) {
	loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Use: speedway registry login",

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
			pskKey, err := storage.Load("psk.key")
			if pskKey == nil || len(pskKey) != 32 {
				logger.Fatalf(status.Warning("Please add this device to your current account or make another account"))
				return
			}
			req := rtmv1.LoginRequest{
				Did:       addr,
				Password:  password,
				AesPskKey: pskKey,
			}
			if err != nil {
				logger.Fatalf(status.Error("LoginRequest Error: %s"), err)
			}
			m := binding.InitMotor()
			res, err := utils.Login(m, req)
			if err != nil {
				logger.Fatalf(status.Error("Login Error: %s"), err)
				return
			}
			logger.Info(status.Debug, "Login Response: %s", res)
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
