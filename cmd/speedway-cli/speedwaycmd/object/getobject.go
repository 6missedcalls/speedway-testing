package object

import (
	"context"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/spf13/cobra"
)

func BootstrapGetObjectCommand(ctx context.Context, logger *golog.Logger) (getObjectCmd *cobra.Command) {
	getObjectCmd = &cobra.Command{
		Use:   "get",
		Short: "Use: get",
		Long:  "Use: get",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.CreateInstance()

			loginResult, err := m.Login(loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login successful"))
			} else {
				logger.Fatalf(status.Error("Login failed"))
				return
			}

			// Prompt for Schema Did
			schemaPrompt := promptui.Prompt{
				Label: "Please enter the associated Schema DID",
			}
			schemaDid, err := schemaPrompt.Run()
			if err != nil {
				logger.Fatalf(status.Error("Schema DID not provided, command cannot continue..."))
				return
			}

			// Prompt for the object CID
			cidPrompt := promptui.Prompt{
				Label: "Enter the CID of the object to get",
			}
			cid, err := cidPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// Retrieve the object
			object, err := m.GetObject(ctx, schemaDid, cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Printf("%v\n", object)
		},
	}
	return
}
