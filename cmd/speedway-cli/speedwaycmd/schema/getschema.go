package schema

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/manifoldco/promptui"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	st "github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/hwid"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/spf13/cobra"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func bootstrapQuerySchemaCommand(ctx context.Context) (querySchemaCmd *cobra.Command) {
	querySchemaCmd = &cobra.Command{
		Use:   "query-schema",
		Short: "Use: speedway schema query-schema",
		Run: func(cmd *cobra.Command, args []string) {
			prompt := promptui.Prompt{
				Label: "Enter your Address",
			}
			did, err := prompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			fmt.Println(chalk.Yellow, "Attempting auto login with DID: "+did, chalk.Reset)
			aesKey, err := storage.LoadKey("AES.key")
			if aesKey == nil || len(aesKey) != 32 {
				fmt.Println(chalk.Yellow.Color("Please provide a valid aesKey"))
			}
			pskKey, err := storage.LoadKey("PSK.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println(chalk.Yellow.Color("Please provide a valid pskKey"))
			}
			loginRequest := rtmv1.LoginRequest{
				Did:       did,
				AesDscKey: aesKey,
				AesPskKey: pskKey,
			}
			hwid, err := hwid.GetHwid()
			if err != nil {
				fmt.Println(chalk.Red, "Hwid Error: %s", err)
			}
			m := mtr.EmptyMotor(hwid)
			loginResult, err := m.Login(loginRequest)
			if loginResult.Success {
				fmt.Println(chalk.Green.Color("Login Successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login Failed"))
				fmt.Println(err)
			}
			// get schema
			creatorPrompt := promptui.Prompt{
				Label: "Enter Creator DID",
			}
			creator, err := creatorPrompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			didPrompt := promptui.Prompt{
				Label: "Enter Schema DID",
			}
			schemaDid, err := didPrompt.Run()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}

			// create new query schema request
			querySchema := rtmv1.QueryWhatIsRequest{
				Creator: creator,
				Did:     schemaDid,
			}

			// query schema
			querySchemaRes, err := m.QueryWhatIs(context.Background(), querySchema)
			if err != nil {
				fmt.Printf("QuerySchema failed %v\n", err)
				return
			}
			// deserialize result
			whatIs := &st.WhatIs{}
			err = whatIs.Unmarshal(querySchemaRes.WhatIs)
			if err != nil {
				fmt.Printf("Unmarshal failed %v\n", err)
				return
			}
			// print result
			fmt.Println(chalk.Blue, "Schema:", whatIs.Schema)
			// create a new get request to ipfs.sonr.ws with cid
			getReq, err := http.NewRequest("GET", "https://ipfs.sonr.ws/ipfs/"+whatIs.Schema.Cid, nil)
			if err != nil {
				fmt.Printf("Request to IPFS failed %v\n", err)
				return
			}
			// get the file from ipfs.sonr.ws
			resp, err := http.DefaultClient.Do(getReq)
			if err != nil {
				fmt.Printf("Do failed %v\n", err)
				return
			}
			// read the file
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				fmt.Printf("ReadAll failed %v\n", err)
				return
			}
			definition := &st.SchemaDefinition{}
			if err = definition.Unmarshal(body); err != nil {
				fmt.Printf("error unmarshalling body: %s", err)
				return
			}
			// print response
			fmt.Println(chalk.Green, "\n", definition, chalk.Reset)
		},
	}
	return
}
