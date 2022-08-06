package MotorRegistry

import (
	"context"
	"fmt"
	"os"

	"github.com/sonr-io/sonr/pkg/crypto"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func storeKey(name string, key []byte) error {
	// TODO: use a better way to store keys
	file, err := os.Create(name)
	if err != nil {
		return err
	}
	defer file.Close()
	_, err = file.Write(key)
	if err != nil {
		return err
	}
	return nil
}

func bootstrapCreateAccountCommand(ctx context.Context) (createCmd *cobra.Command) {
	createCmd = &cobra.Command{
		Use:   "register",
		Short: "Use: registry register -p <password>",

		Run: func(cmd *cobra.Command, args []string) {
			password, _ := cmd.Flags().GetString("password")
			if password == "" {
				fmt.Println("Please provide a password")
				return
			}
			aesKey, err := crypto.NewAesKey()
			if err != nil {
				fmt.Println("err", err)
			}
			storeKey("AES.key", aesKey)
			fmt.Println("aesKey", aesKey)
			req := rtmv1.CreateAccountRequest{
				Password:  password,
				AesDscKey: aesKey,
			}
			fmt.Println("request", req)
			if err != nil {
				fmt.Println("reqBytes err", err)
			}
			m := mtr.EmptyMotor("Speedway_Node")
			res, err := m.CreateAccount(req)
			if err != nil {
				fmt.Println("err", err)
			}
			storeKey("PSK.key", res.AesPsk)
		},
	}
	createCmd.Flags().StringP("password", "p", "", "password")
	return
}
