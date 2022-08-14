package object

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/resolver"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

// ! Speak to Nick about JSON versus what I'm doing now

func BootstrapBuildObjectCommand(ctx context.Context) (buildObjCmd *cobra.Command) {
	buildObjCmd = &cobra.Command{
		Use:   "build",
		Short: "Use: build",
		Long:  "Use: build",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := initmotor.InitMotor()

			loginResult, err := account.Login(m, loginRequest)
			if loginResult.Success {
				fmt.Println(chalk.Green.Color("Login Successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login Failed"), err)
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

			// query whatis
			querySchema, err := m.QueryWhatIs(ctx, rtmv1.QueryWhatIsRequest{
				Creator: m.GetDID().String(),
				Did:     schemaDid,
			})
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Printf("%v\n", querySchema.WhatIs)

			// deserialize the whatis
			whatIs := resolver.DeserializeWhatIs(querySchema.WhatIs)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}

			definition, err := resolver.ResolveIPFS(whatIs.Schema.Cid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			fmt.Println(chalk.Green, "Resolved Schema:", definition)

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
					Label: "Enter Field Value for " + field.Name,
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
