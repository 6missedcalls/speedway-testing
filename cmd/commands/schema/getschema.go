package schema

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

// Method to get a schema
// Command Example: speedway schema get
func bootstrapQuerySchemaCommand(ctx context.Context, logger *golog.Logger) (querySchemaCmd *cobra.Command) {
	querySchemaCmd = &cobra.Command{
		Use:   "get [did]",
		Short: "Use: Returns a schema by the provided did",
		Long:  "Returns a schema matching the did, if not provided the cli will prompt",
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
			var did string = ""
			if len(args) > 0 {
				did = args[0]
			}
			// get schema
			if did == "" {
				did = (&prompter.Prompter{
					Message: "Enter DID",
				}).Prompt()
				if did == "" {
					logger.Fatal(status.Error("DID is required"))
					return
				}
			}
			querySchemaReq := rtmv1.QueryWhatIsRequest{
				Creator: m.GetDID().String(),
				Did:     did,
			}

			// query schema
			querySchemaRes, err := m.QueryWhatIs(querySchemaReq)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			defStr, _ := utils.MarshalJsonFmt(querySchemaRes.WhatIs.Schema)
			logger.Info(status.Debug, "Schema:", defStr)
		},
	}

	querySchemaCmd.AddCommand(bootstrapQuerySchemabyCreatorCommand(ctx, logger))
	return
}

func bootstrapQuerySchemabyCreatorCommand(ctx context.Context, logger *golog.Logger) (querySchemaByCreatorCmd *cobra.Command) {
	querySchemaByCreatorCmd = &cobra.Command{
		Use:   "all",
		Short: "Use: retrieves all Schemas for user",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf("Login Error: ", err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatal(status.Error("Login Failed"))
				return
			}

			logger.Infof("Querying Schemas for creator %s", m.GetAddress())
			res, err := m.QueryWhatIsByCreator(rtmv1.QueryWhatIsByCreatorRequest{
				Creator: m.GetDID().String(),
			})

			if err != nil {
				logger.Fatalf("error while querying where is by creator %s: %s", m.GetAddress(), err)
			}

			for _, wi := range res.WhatIs {
				b, _ := json.MarshalIndent(wi, "", "\t")
				fmt.Println(string(b))
			}
		},
	}

	return
}
