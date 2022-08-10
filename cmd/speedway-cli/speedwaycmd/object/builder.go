package object

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
)

func BootstrapBuildObjectCommand(ctx context.Context) (buildObjCmd *cobra.Command) {
	buildObjCmd = &cobra.Command{
		Use:   "build",
		Short: "Use: build",
		Long:  "Use: build",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := initmotor.InitMotor()

			loginResult, err := m.Login(loginRequest)
			if loginResult.Success {
				fmt.Println(chalk.Green.Color("Login Successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login Failed"), err)
			}

			// prompt for schemaDid
			schemaDidPrompt := promptui.Prompt{
				Label: "Enter Schema DID",
			}
			schemaDid, err := schemaDidPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}

			// Create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}

			fmt.Println(chalk.Green.Color("Object Builder Created"), objBuilder)
		},
	}
	return
}
