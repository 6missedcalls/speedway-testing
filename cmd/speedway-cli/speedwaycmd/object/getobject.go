package object

import (
	"context"
	"encoding/json"
	"fmt"

	shell "github.com/ipfs/go-ipfs-api"
	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/spf13/cobra"
)

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

			var id string
			if cid, err := cmd.Flags().GetString("cid"); err == nil && cid == "" {
				// Prompt for the object CID
				cidPrompt := promptui.Prompt{
					Label: "Enter the CID of the object to get",
				}
				id, err = cidPrompt.Run()
				if err != nil {
					fmt.Printf("Command failed %v\n", err)
					return
				}
			}
			sh := shell.NewShell(m.Instance.GetClient().GetIPFSApiAddress())
			// Retrieve the object
			object := make(map[string]interface{})
			err = sh.DagGet(id, &object)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			b, _ := json.MarshalIndent(object, "", "\t")
			fmt.Print(string(b))
		},
	}

	getObjectCmd.PersistentFlags().String("cid", "", "CID  of the object to resolve")
	return
}
