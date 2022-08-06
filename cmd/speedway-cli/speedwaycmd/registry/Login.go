package MotorRegistry

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func loadKey(path string) ([]byte, error) {
	var file *os.File
	if _, err := os.Stat(path); err != nil {
		if os.IsNotExist(err) {
			return nil, err
		}
		return nil, err
	}
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	return data, nil
}

func bootstrapLoginCommand(ctx context.Context) (loginCmd *cobra.Command) {
	loginCmd = &cobra.Command{
		Use:   "login",
		Short: "Use: speedway login -did <did> -password <password>",

		Run: func(cmd *cobra.Command, args []string) {
			did, _ := cmd.Flags().GetString("did")
			password, _ := cmd.Flags().GetString("password")
			if did == "" || password == "" {
				fmt.Println("Please provide a did and password")
				return
			}
			pskKey, err := loadKey("PSK.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println("Please provide a valid pskKey")
				return
			}
			fmt.Println("pskKey", pskKey)
			req := rtmv1.LoginRequest{
				Did:       did,
				Password:  password,
				AesPskKey: pskKey,
			}
			if err != nil {
				fmt.Println("reqBytes err", err)
			}
			fmt.Println("request", req)
			m := mtr.EmptyMotor("Test Node")
			res, err := m.Login(req)
			if err != nil {
				fmt.Println("err", err)
			}
			fmt.Println("res", res)
			if res.Success {
				fmt.Println("DIDDocument", m.DIDDocument)
				fmt.Println("Address", m.Address)
			} else {
				fmt.Println("Login failed")
			}
		},
	}
	loginCmd.Flags().StringP("did", "d", "", "did")
	loginCmd.Flags().StringP("password", "p", "", "password")
	return
}
