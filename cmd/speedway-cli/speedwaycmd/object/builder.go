package object

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

func BootstrapBuildObjectCommand(ctx context.Context, logger *golog.Logger) (buildObjCmd *cobra.Command) {
	buildObjCmd = &cobra.Command{
		Use:   "build",
		Short: "Use: build",
		Long:  "Use: build",
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
				logger.Fatalf(status.Error("Login Failed"))
				return
			}

			// prompt for schemaDid
			schemaDidPrompt := promptui.Prompt{
				Label: "Enter Schema DID",
			}
			schemaDid, err := schemaDidPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// query whatis req
			querySchemaReq := rtmv1.QueryWhatIsRequest{
				Creator: m.GetDID().String(),
				Did:     schemaDid,
			}

			// query whatis
			querySchema, err := m.QuerySchema(querySchemaReq)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// ! Might Work (not tested)
			definition, err := utils.ResolveIPFS(querySchema.WhatIs.Schema.Cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			logger.Info(status.Debug, "Resolved Schema: ", definition)

			fpPrompt := promptui.Prompt{
				Label: "Please enter the filepath to the object",
			}
			fp, err := fpPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// Open the file and read it
			data, err := utils.GetFile(fp)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// Add the Label to the object
			objBuilder.SetLabel(data.Label)

			// Iterate through object and add to builder
			for k, v := range data.Object {
				objBuilder.Set(k, v)
			}

			// Upload the object
			upload, err := objBuilder.Upload()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			logger.Info("Upload Reference: %v\n", upload.Reference)

		},
	}
	return
}
