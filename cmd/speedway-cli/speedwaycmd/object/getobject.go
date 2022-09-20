package object

import (
	"context"
	"fmt"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/spf13/cobra"
)

// Method to query an object
// Command Example: speedway object get
func BootstrapGetObjectCommand(ctx context.Context, logger *golog.Logger) (getObjectCmd *cobra.Command) {
	getObjectCmd = &cobra.Command{
		Use:   "query",
		Short: "Query an object on the Sonr Network.",
		Long: `Query an object on the Sonr Network.
		You can utilize the -cid flag to query an object by its CID (built for scripting) or you can simply follow allong the prompts to query an object by its CID.`,
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.CreateInstance()

			loginResult, err := m.Login(loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Login Error: "), err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login successful"))
			} else {
				logger.Fatalf(status.Error("Login failed"))
				return
			}

			var cid string
			if cid, err = cmd.Flags().GetString("cid"); err == nil && cid == "" {
				cid = (&prompter.Prompter{
					Message: "Object CID: ",
				}).Prompt()
			}

			var did string
			if did, err = cmd.Flags().GetString("did"); err == nil && did == "" {
				did = (&prompter.Prompter{
					Message: "Schema DID: ",
				}).Prompt()
			}

			object, err := m.GetObject(ctx, did, cid)
			if err != nil {
				fmt.Printf("GetObject failed %v\n", err)
				return
			}

			logger.Infof("Object: %v", object)
		},
	}
	getObjectCmd.PersistentFlags().String("did", "", "DID of the schema to resolve")
	getObjectCmd.PersistentFlags().String("cid", "", "CID of the object to resolve")
	return
}
