package registry

import (
	"context"
	"errors"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/sonr/pkg/crypto/mpc"
	rtmv1 "github.com/sonr-io/sonr/pkg/motor/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapCreateAccountCommand(ctx context.Context) (createCmd *cobra.Command) {
	createCmd = &cobra.Command{
		Use:   "create",
		Short: "Use: registry create",

		Run: func(cmd *cobra.Command, args []string) {
			validate := func(input string) error {
				if len(input) < 8 {
					return errors.New("password must be at least 8 characters")
				}
				return nil
			}
			prompt := promptui.Prompt{
				Label:    "Password",
				Validate: validate,
			}
			result, err := prompt.Run()
			if err != nil {
				fmt.Printf("Command failed %s\n", err)
				return
			}
			aesKey, err := mpc.NewAesKey()
			if err != nil {
				fmt.Println(status.Error("Error: %s"), err)
			}
			if storage.Store("aes.key", aesKey) != nil {
				fmt.Println(status.Error("Storage Error: %s"), err)
			}

			req := rtmv1.CreateAccountRequest{
				Password:  result,
				AesDscKey: aesKey,
			}
			fmt.Println(status.Debug, "Create Account Request: %s", req)
			if err != nil {
				fmt.Println(status.Error("Error: %s"), err)
			}
			m := binding.InitMotor()
			res, err := utils.CreateAccount(m, req)
			if err != nil {
				fmt.Println(status.Error("CreateAccount Error: %s"), err)
				return
			}

			fmt.Println(status.Debug, "Create Account Response: %s", res)
			fmt.Println(status.Info, "Account Address: %s", res.Address)
		},
	}
	return
}
