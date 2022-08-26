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
				fmt.Println(status.Error("Error: %s"), err)
				return
			}
			if loginResult.Success {
				fmt.Println(status.Success("Login successful"))
			} else {
				fmt.Println(status.Error("Login failed"))
				return
			}

			creatorDid := m.GetDID()
			if err != nil {
				fmt.Println(status.Error("Error: %s"), err)
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
				// todo: run prompt again
			}

			// query whatis req
			querySchemaReq := rtmv1.QueryWhatIsRequest{
				Creator: creatorDid.String(),
				Did:     schemaDid,
			}

			querySchema, err := m.QueryWhatIs(querySchemaReq)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			definition, err := utils.ResolveIPFS(querySchema.WhatIs.Schema.Cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Println(status.Debug, "Resolved Schema:", definition)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			objectLabel := promptui.Prompt{
				Label: "Enter Object Label",
			}
			label, err := objectLabel.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			objBuilder.SetLabel(label)

			for _, field := range definition.Fields {
				valuePrompt := promptui.Prompt{
					Label: "Enter Value for " + field.Name,
				}
				value, err := valuePrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
				}
				err = objBuilder.Set(field.Name, value)
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
				}
			}

			// build the object
			build, err := objBuilder.Build()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Printf("Built: %v\n", build)

			// upload the object
			upload, err := objBuilder.Upload()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Printf("Upload: %v\n", upload.Reference)
		},
	}
	return
}
