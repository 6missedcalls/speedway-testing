package object

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/retrieve"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
)

func BootstrapGetObjectCommand(ctx context.Context) (getObjectCmd *cobra.Command) {
	getObjectCmd = &cobra.Command{
		Use:   "query",
		Short: "Use: query",
		Long:  "Use: query",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := initmotor.InitMotor()

			loginResult, err := m.Login(loginRequest)
			if loginResult.Success {
				fmt.Println(chalk.Green.Color("Login Successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login Failed"), err)
				return
			}

			schemaPrompt := promptui.Prompt{
				Label: "Please enter the associated schema DID",
			}
			schemaDid, err := schemaPrompt.Run()
			if err != nil {
				fmt.Println(chalk.Red.Color("Error"), err)
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

			object, err := retrieve.GetObject(m, schemaDid, cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Printf("%v\n", object)
		},
	}
	return
}
