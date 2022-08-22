package object

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func BootstrapBuildObjectCommand(ctx context.Context) (buildObjCmd *cobra.Command) {
	buildObjCmd = &cobra.Command{
		Use:   "build",
		Short: "Use: build",
		Long:  "Use: build",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				fmt.Println(status.Error("Login Error: "), err)
				return
			}
			if loginResult.Success {
				fmt.Println(status.Success("Login successful"))
			} else {
				fmt.Println(status.Error("Login failed"))
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

			// query whatis
			querySchema, err := m.QueryWhatIs(ctx, rtmv1.QueryWhatIsRequest{
				Creator: m.GetDID().String(),
				Did:     schemaDid,
			})
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			// deserialize the whatis
			whatIs := utils.DeserializeWhatIs(querySchema.WhatIs)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			definition, err := utils.ResolveIPFS(whatIs.Schema.Cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Println(status.Debug, "Resolved Schema: ", definition)

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
			fmt.Printf("Upload Reference: %v\n", upload.Reference)

		},
	}
	return
}
