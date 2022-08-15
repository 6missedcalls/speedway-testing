package registry

import (
	"context"
	"errors"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/sonr/pkg/crypto/mpc"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
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
				fmt.Println(status.Error, "Error: %s", err)
			}
			if storage.StoreKey("aes.key", aesKey) != nil {
				fmt.Println(status.Error, "Storage Error: %s", err)
			}

			req := rtmv1.CreateAccountRequest{
				Password:  result,
				AesDscKey: aesKey,
			}
			fmt.Println(status.Debug, "Create Account Request: %s", req)
			if err != nil {
				fmt.Println(status.Error, "Error: %s", err)
			}

			res, err := account.CreateAccount(req)
			if err != nil {
				fmt.Println(status.Error, "CreateAccount Error: %s", err)
				return
			}

			fmt.Println(status.Debug, "Create Account Response: %s", res)
			fmt.Println(status.Debug, "Account Address: %s", res.Address)
		},
	}
	return
}
