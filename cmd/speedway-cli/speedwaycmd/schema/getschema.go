package schema

import (
	"context"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

func bootstrapQuerySchemaCommand(ctx context.Context, logger *golog.Logger) (querySchemaCmd *cobra.Command) {
	querySchemaCmd = &cobra.Command{
		Use:   "query",
		Short: "Use: speedway schema query",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := m.Login(loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Error: %s"), err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login successful"))
			} else {
				logger.Fatalf(status.Error("Login failed"))
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
				return
			}

			querySchemaReq := rtmv1.QueryWhatIsRequest{
				Creator: creator,
				Did:     schemaDid,
			}

			// query schema
			querySchemaRes, err := m.QueryWhatIs(querySchemaReq)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			cid := querySchemaRes.WhatIs.Schema.Cid
			fmt.Println(cid)

			definition, err := utils.ResolveIPFS(cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			logger.Info(status.Debug, "Schema:", definition)

		},
	}
	return
}
