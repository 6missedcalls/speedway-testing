package registry

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/denisbrodbeck/machineid"
	"github.com/manifoldco/promptui"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func loadKey(name string) ([]byte, error) {
	var file *os.File
	if _, err := os.Stat(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/keys/"+name)); err != nil {
		if os.IsNotExist(err) {
			return nil, err
		}
		return nil, err
	}
	file, err := os.Open(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/keys/"+name))
	if err != nil {
		return nil, err
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	return data, err
}

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
			pskKey, err := loadKey("PSK.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println(chalk.Yellow, "Please provide a valid pskKey", chalk.Reset)
				return
			}
			fmt.Println("pskKey", pskKey)
			req := rtmv1.LoginRequest{
				Did:       did,
				Password:  password,
				AesPskKey: pskKey,
			}
			if err != nil {
				fmt.Println(chalk.Red, "Error: %s", err)
			}
			hwid, err := machineid.ID()
			if err != nil {
				fmt.Println("err", err)
			}
			m := mtr.EmptyMotor(hwid)
			res, err := m.Login(req)
			if err != nil {
				fmt.Println(chalk.Red, "Login Error: %s", err)
			}
			fmt.Println(chalk.Green, "Login Response: %s", res)
			if res.Success {
				fmt.Println("DIDDocument", m.DIDDocument)
				fmt.Println("Address", m.Address)
			} else {
				fmt.Println(chalk.Red, "Login failed")
			}
		},
	}
	return
}
