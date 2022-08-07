package registry

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/denisbrodbeck/machineid"
	"github.com/manifoldco/promptui"
	"github.com/sonr-io/sonr/pkg/crypto"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func storeKey(name string, key []byte) error {
	homedir, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	if _, err := os.Stat(homedir + "/.speedway/keys/" + name); os.IsNotExist(err) {
		err := os.MkdirAll(homedir+"/.speedway/keys/", 0700)
		if err != nil {
			return err
		}
	}
	store, err := os.Create(homedir + "/.speedway/keys/" + name)
	if err != nil {
		return err
	}
	_, err = store.Write(key)
	defer store.Close()
	return err
}

func bootstrapCreateAccountCommand(ctx context.Context) (createCmd *cobra.Command) {
	createCmd = &cobra.Command{
		Use:   "register",
		Short: "Use: registry register",

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
				fmt.Printf("Prompt failed %s\n", err)
				return
			}
			aesKey, err := crypto.NewAesKey()
			if err != nil {
				fmt.Println("err", err)
			}
			storeKey("AES.key", aesKey)
			fmt.Println("aesKey", aesKey)
			req := rtmv1.CreateAccountRequest{
				Password:  result,
				AesDscKey: aesKey,
			}
			fmt.Println("request", req)
			if err != nil {
				fmt.Println("reqBytes err", err)
			}
			hwid, err := machineid.ID()
			if err != nil {
				log.Fatal(err)
			}
			m := mtr.EmptyMotor(hwid)
			res, err := m.CreateAccount(req)
			if err != nil {
				fmt.Println("err", err)
			}
			storeKey("PSK.key", res.AesPsk)
			fmt.Println("res", res)
		},
	}
	return
}
