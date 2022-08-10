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

			whatIs := resolver.DeserializeWhatIs(querySchema.WhatIs)
			definition := resolver.ResolveIPFS(whatIs.Schema.Cid)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(SchemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}

			labelPrompt := promptui.Prompt{
				Label: "Enter a label for the object",
			}
			label, err := labelPrompt.Run()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			objBuilder.SetLabel(label)

			for range definition.Fields {
				validate := func(input string) error {
					for _, field := range definition.Fields {
						if field.Name == input {
							return nil
						}
					}
					return fmt.Errorf("%s is not a valid field name", input)
				}
				namePrompt := promptui.Prompt{
					Label:    "Enter a name for the field",
					Validate: validate,
				}
				fieldPrompt := promptui.Prompt{
					Label: "Enter a value for the field",
				}
				name, err := namePrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					panic(err)
				}
				value, err := fieldPrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					panic(err)
				}
				objBuilder.Set(name, value)
			}

			// TODO - fix upload

			// build the object
			toUpload, err := objBuilder.Build()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				panic(err)
			}
			fmt.Printf("%v\n", toUpload)

			// upload the object
			uploadResult, err := objBuilder.Upload()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
			}
			fmt.Printf("%v\n", uploadResult)

			fmt.Println(objBuilder)
		},
	}
	return
}
