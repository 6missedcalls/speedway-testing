package object

import (
	"context"
	"fmt"
	"math"

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
		Long:  "Use: builds an object verified against a schema, if no flags are provided data will be prompted for",
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

			var schemaDid string
			if schemaDid, err = cmd.Flags().GetString("did"); err == nil && schemaDid == "" {
				// prompt for schemaDid
				schemaDidPrompt := promptui.Prompt{
					Label: "Enter Schema DID",
				}
				schemaDid, err = schemaDidPrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
					// todo: run prompt again
				}
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
			defStr, _ := utils.MarshalJsonFmt(definition)
			logger.Infof("Resolved Schema: %s", defStr)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			if label, err := cmd.Flags().GetString("label"); err == nil && label == "" {
				objectLabel := promptui.Prompt{
					Label: "Enter Object Label",
				}
				label, err := objectLabel.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
				}
				objBuilder.SetLabel(label)
			} else {
				objBuilder.SetLabel(label)
			}

			if filePath, err := cmd.Flags().GetString("file"); err == nil && filePath == "" {

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
			} else {
				def, err := utils.LoadObjectDefinitionFromDisk(filePath)
				if err != nil {
					logger.Fatalf("error while attempting to load object definition: %s", err)
				}

				for k, v := range def {
					// TODO: this is a hack, for floats to typecast to int type, will throw bad things if it cant. which means it should stay a float.
					// using the error on the typecast to know when something "is" a float.
					switch v.(type) {
					case float32:
						value := float64(v.(float32))
						if _, rem := math.Modf(value); rem > 0 {
							objBuilder.Set(k, value)
						} else {
							objBuilder.Set(k, int(v.(float32)))
						}
						continue
					case float64:
						value := float64(v.(float64))
						if _, rem := math.Modf(value); rem > 0 {
							objBuilder.Set(k, value)
						} else {
							objBuilder.Set(k, int(v.(float64)))
						}
						continue
					}
					err := objBuilder.Set(k, v)
					if err != nil {
						logger.Errorf("Error while validating: %s: %s", k, err)
					}
				}
			}

			// build the object
			build, err := objBuilder.Build()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			buildStr, _ := utils.MarshalJsonFmt(build)
			logger.Debugf("Built: %s\n", buildStr)

			// upload the object
			upload, err := objBuilder.Upload()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			uploadStr, _ := utils.MarshalJsonFmt(upload)
			fmt.Printf("Upload: %v\n", uploadStr)
		},
	}

	buildObjCmd.PersistentFlags().String("did", "", "identifier of a schema to associate with the object")
	buildObjCmd.PersistentFlags().String("file", "", "path to an object definition matching a provided schema")
	buildObjCmd.PersistentFlags().String("label", "", "given label for the object being built")
	return
}
