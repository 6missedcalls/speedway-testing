package registry

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func bootstrapLoginCommand(ctx context.Context) (loginCmd *cobra.Command) {
	loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Use: speedway registry login",

		Run: func(cmd *cobra.Command, args []string) {
			prompt := promptui.Prompt{
				Label: "Enter your Address",
			}
			did, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			prompt = promptui.Prompt{
				Label: "Enter your Password",
			}
			password, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			pskKey, err := storage.LoadKey("psk.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println(status.Warning, "Please add this device to your current account or make another account")
				return
			}
			req := rtmv1.LoginRequest{
				Did:       did,
				Password:  password,
				AesPskKey: pskKey,
			}
			if err != nil {
				fmt.Println(status.Error, "LoginRequest Error: %s", err)
			}
			m := initmotor.InitMotor()
			res, err := account.Login(m, req)
			if err != nil {
				fmt.Println(status.Error, "Login Error: %s", err)
				return
			}
			fmt.Println(status.Debug, "Login Response: %s", res)
			if res.Success {
				fmt.Println(status.Success, "Login Successful")
			} else {
				fmt.Println(status.Error, "Login failed")
				return
			}
		},
	}
	return
}
