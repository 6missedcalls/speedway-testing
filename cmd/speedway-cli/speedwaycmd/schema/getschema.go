package schema

import (
	"context"
	"fmt"
	"os"

	"github.com/manifoldco/promptui"
	st "github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/resolver"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func bootstrapQuerySchemaCommand(ctx context.Context) (querySchemaCmd *cobra.Command) {
	querySchemaCmd = &cobra.Command{
		Use:   "query",
		Short: "Use: speedway schema query",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()
			fmt.Println(loginRequest)

			m := initmotor.InitMotor()

			loginResult, err := m.Login(loginRequest)
			if loginResult.Success {
				fmt.Println(chalk.Green.Color("Login Successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login Failed"), err)
			}

			// get schema
			creatorPrompt := promptui.Prompt{
				Label: "Enter Creator DID",
			}
			creator, err := creatorPrompt.Run()
			if err != nil {
				fmt.Printf("Command Failed %v\n", err)
				return
			}
			didPrompt := promptui.Prompt{
				Label: "Enter Schema DID",
			}
			schemaDid, err := didPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				os.Exit(92)
			}

			// create new query schema request
			querySchema := rtmv1.QueryWhatIsRequest{
				Creator: creator,
				Did:     schemaDid,
			}

			// query schema
			querySchemaRes, err := m.QueryWhatIs(context.Background(), querySchema)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				os.Exit(93)
			}
			// deserialize result
			whatIs := &st.WhatIs{}
			err = whatIs.Unmarshal(querySchemaRes.WhatIs)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				os.Exit(94)
			}
			// print result
			fmt.Println(chalk.Blue, "Schema:", whatIs.Schema)

			resolver.ResolveIPFS(whatIs.Schema.Cid)
		},
	}
	return
}
