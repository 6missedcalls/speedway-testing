package object

import (
	"context"
	"fmt"

	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/resolver"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
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
			SchemaDid, err := schemaDidPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}

			// query whatis
			querySchema, err := m.QueryWhatIs(ctx, rtmv1.QueryWhatIsRequest{
				Creator: m.GetDID().String(),
				Did:     SchemaDid,
			})
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			fmt.Printf("%v\n", querySchema.WhatIs)

			// deserialize the whatis
			whatIs := resolver.DeserializeWhatIs(querySchema.WhatIs)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			fmt.Println(chalk.Green, "Deserialized WhatIs:", whatIs)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(SchemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			definition := resolver.ResolveIPFS(whatIs.Schema.Cid)
			fmt.Println(chalk.Green, "Resolved Schema:", definition)

			objectLabel := promptui.Prompt{
				Label: "Enter Object Label",
			}
			label, err := objectLabel.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			objBuilder.SetLabel(label)

			// todo - prompt for fields
			for range definition.Fields {
				namePrompt := promptui.Prompt{
					Label: "Enter Field Name",
				}
				name, err := namePrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					panic(err)
				}
				valuePrompt := promptui.Prompt{
					Label: "Enter Field Value",
				}
				value, err := valuePrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					panic(err)
				}
				objBuilder.Set(name, value)
			}

			build, err := objBuilder.Build()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			fmt.Printf("%v\n", build)

			// upload the object
			upload, err := objBuilder.Upload()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			fmt.Printf("%v\n", upload.Reference)

		},
	}
	return
}
