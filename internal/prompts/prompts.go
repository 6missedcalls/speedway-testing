package prompts

import (
	"fmt"
	"time"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	btv1 "github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
)

type LoginReturn struct {
	Did       string
	AesDscKey []byte
	AesPskKey []byte
}

func fallbackLoginPrompt() (string, error) {
	fmt.Println(status.Warning("Attempting Manual Login"), status.Reset)
	did := (&prompter.Prompter{
		Message: "Enter your Address",
	}).Prompt()
	if did == "" {
		return "", fmt.Errorf("did cannot be empty")
	}
	return did, nil
}

func LoginPrompt() rtmv1.LoginRequest {
	// Load the address from address.snr if it exists
	address, err := utils.LoadInfo("address.snr")
	// if error or address is empty, prompt for address with fallback prompt
	if err != nil || address == "" {
		fallbackAddr, err := fallbackLoginPrompt()
		if err != nil {
			fmt.Println(status.Error("Fallback Error: %s"), err)
			return rtmv1.LoginRequest{}
		}
		address = fallbackAddr
	}

	loginRequest := rtmv1.LoginRequest{
		AccountId: address,
	}
	return loginRequest
}

func QuitSelector(label string) bool {
	result := (&prompter.Prompter{
		Choices: []string{"Yes", "No"},
		Message: label,
	}).Prompt()
	if result == "Yes" {
		return false
	}
	return true
}

func LabelPrompt(label string, logger *golog.Logger) string {
	label = (&prompter.Prompter{
		Message: label,
	}).Prompt()

	if label == "" {
		logger.Warn("Label cannot be empty")
		return LabelPrompt(label, logger)
	}

	return label
}

func ResourceIdentifierPrompt(logger *golog.Logger) string {
	value := (&prompter.Prompter{
		Choices: []string{"None", "DID", "CID"},
		Message: "Select the resource identifer",
	}).Prompt()

	if value == "" {
		logger.Warn("Resource Identifier cannot be empty")
		return ResourceIdentifierPrompt(logger)
	}

	return value
}

func BucketContentPrompt(logger *golog.Logger) []*btv1.BucketItem {
	var content []*btv1.BucketItem = make([]*btv1.BucketItem, 0)
	addContent := QuitSelector("Add Content?")
	if addContent {
		return content
	}
	var rerun = false
	for rerun != true {
		name := LabelPrompt("enter content name", logger)
		uri := LabelPrompt("URI for content", logger)
		ts := time.Now().Unix()
		_ = ResourceIdentifierPrompt(logger)
		sd := LabelPrompt("Schema for object", logger)
		content = append(content, &btv1.BucketItem{
			Name:      name,
			Uri:       uri,
			Timestamp: ts,
			Type:      btv1.ResourceIdentifier_CID,
			SchemaDid: sd,
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
