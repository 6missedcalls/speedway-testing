package prompts

import (
	"fmt"
	"os"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

// create a struct to return all the information needed to login
type LoginReturn struct {
	Did       string
	AesDscKey []byte
	AesPskKey []byte
}

func LoginPrompt() rtmv1.LoginRequest {
	prompt := promptui.Prompt{
		Label: "Enter your Address",
	}
	did, err := prompt.Run()
	if err != nil {
		fmt.Printf("Prompt failed %v\n", err)
		os.Exit(1)
	}
	fmt.Println(chalk.Yellow, "Attempting auto login with DID: "+did, chalk.Reset)
	aesKey, err := storage.LoadKey("aes.key")
	if aesKey == nil || len(aesKey) != 32 {
		fmt.Println(chalk.Yellow.Color("Please add this device to your current account or make another account"))
	}
	if err != nil {
		fmt.Println(chalk.Red, "AES Key Error: %s", err)
		os.Exit(1)
	}
	pskKey, err := storage.LoadKey("psk.key")
	if pskKey == nil || len(pskKey) != 32 {
		fmt.Println(chalk.Yellow.Color("Please add this device to your current account or make another account"))
	}
	if err != nil {
		fmt.Println(chalk.Red, "PSK Key Error: %s", err)
		os.Exit(1)
	}
	loginRequest := rtmv1.LoginRequest{
		Did:       did,
		AesDscKey: aesKey,
		AesPskKey: pskKey,
	}
	return loginRequest
}
