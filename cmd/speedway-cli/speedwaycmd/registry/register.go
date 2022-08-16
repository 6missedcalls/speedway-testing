package registry

import (
	"context"
	"errors"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/sonr/pkg/crypto/mpc"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
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
				fmt.Println("err", err)
			}
			if storage.StoreKey("aes.key", aesKey) != nil {
				fmt.Println("err", err)
			}

			req := rtmv1.CreateAccountRequest{
				Password:  result,
				AesDscKey: aesKey,
			}
			fmt.Println(chalk.Yellow, "Creating account...", chalk.Reset)
			if err != nil {
				fmt.Println(chalk.Red, "Create Account Error: ", err, chalk.Reset)
			}

			res, err := account.CreateAccount(req)
			if err != nil {
				fmt.Println("err", err)
				return
			}

			fmt.Println(chalk.Green, "Create Account Response: ", res, chalk.Reset)
			fmt.Println(chalk.Bold, "Address: ", res.Address, chalk.Reset)
		},
	}
	return
}
