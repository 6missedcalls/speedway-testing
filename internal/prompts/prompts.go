package prompts

import (
	"fmt"
	"time"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	btv1 "github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
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

	aesKey, pskKey, err := storage.AutoLoad()
	if err != nil {
		fmt.Println(status.Error("AutoLoad Error: %s"), err)
		return rtmv1.LoginRequest{}
	}
	// Login Request
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
		fmt.Printf("Prompt failed %v\n", err)
		return true
	}
	if result == "Yes" {
		return false
	}
	return true
}

func LabelPrompt(label string, logger *golog.Logger) string {
	prompt := promptui.Prompt{
		Label: label,
	}
	label, err := prompt.Run()

	if err != nil {
		logger.Fatalf("Error while running label prompt: %s", err)
	}

	return label
}

func ResourceIdentifierPrompt(logger *golog.Logger) string {
	prompt := promptui.Select{
		Label: "Select the resource identifer",
		Items: []string{
			"None",
			"DID",
			"CID",
		},
	}

	_, value, _ := prompt.Run()

	return value
}

func BucketContentPrompt(logger *golog.Logger) []*btv1.BucketItem {
	var content []*btv1.BucketItem
	var rerun = false
	for rerun != true {
		name := LabelPrompt("enter content name", logger)
		uri := LabelPrompt("URI for content", logger)
		ts := time.Now().Unix()
		_ = ResourceIdentifierPrompt(logger)
		content = append(content, &btv1.BucketItem{
			Name:      name,
			Uri:       uri,
			Timestamp: ts,
			Type:      btv1.ResourceIdentifier_CID,
		})
		rerun = QuitSelector("Would you like to add another item?")
	}

	return content
}

func SplashScreen() string {
	return `
	███████╗ ██████╗ ███╗   ██╗██████╗     ███████╗██████╗ ███████╗███████╗██████╗ ██╗    ██╗ █████╗ ██╗   ██╗
	██╔════╝██╔═══██╗████╗  ██║██╔══██╗    ██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗██║    ██║██╔══██╗╚██╗ ██╔╝
	███████╗██║   ██║██╔██╗ ██║██████╔╝    ███████╗██████╔╝█████╗  █████╗  ██║  ██║██║ █╗ ██║███████║ ╚████╔╝ 
	╚════██║██║   ██║██║╚██╗██║██╔══██╗    ╚════██║██╔═══╝ ██╔══╝  ██╔══╝  ██║  ██║██║███╗██║██╔══██║  ╚██╔╝  
	███████║╚██████╔╝██║ ╚████║██║  ██║    ███████║██║     ███████╗███████╗██████╔╝╚███╔███╔╝██║  ██║   ██║   
	╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝    ╚══════╝╚═╝     ╚══════╝╚══════╝╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   
					Welcome to the Sonr Speedway 🏎																																																		
	`
}
