package prompts

import (
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type LoginReturn struct {
	Did       string
	AesDscKey []byte
	AesPskKey []byte
}

func fallbackLoginPrompt() (string, error) {
	fmt.Println(status.Warning("Attempting Manual Login"), status.Reset)
	prompt := promptui.Prompt{
		Label: "Enter your Address",
	}
	did, err := prompt.Run()
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return "", err
	}
	return did, nil
}

func LoginPrompt() rtmv1.LoginRequest {
	fmt.Println(status.Info, "Attempting Auto Login", status.Reset)

	// Load the address from address.snr if it exists
	address, err := storage.LoadInfo("address.snr")
	// if error or address is empty, prompt for address with fallback prompt
	if err != nil || address == "" {
		fallbackAddr, err := fallbackLoginPrompt()
		if err != nil {
			fmt.Println(status.Error("Fallback Error: %s"), err)
			return rtmv1.LoginRequest{}
		}
		address = fallbackAddr
	}

	// Load the keys if they exist
	aesKey, pskKey, err := storage.AutoLoad()
	if err != nil {
		fmt.Println(status.Error("Key Error: %s"), err)
	}

	loginRequest := rtmv1.LoginRequest{
		Did:       address,
		AesDscKey: aesKey,
		AesPskKey: pskKey,
	}
	return loginRequest
}

func QuitSelector(label string) bool {
	prompt := promptui.Select{
		Label: label,
		Items: []string{"Yes", "No"},
	}
	_, result, err := prompt.Run()
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return false
	}
	if result == "Yes" {
		return true
	}
	return false
}