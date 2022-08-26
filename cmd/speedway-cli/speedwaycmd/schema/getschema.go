package schema

import (
	"context"
	"fmt"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/retrieve"
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

			loginResult, err := utils.Login(m, loginRequest)
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

			schema, err := retrieve.GetSchema(ctx, m, creator, schemaDid)
			if schema.WhatIs != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			cid := schema.WhatIs.Schema.Cid
			fmt.Println(cid)
			definition, err := utils.ResolveIPFS(cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			logger.Info(status.Debug, "Schema: %v\n", definition)

		},
	}
	return
}
