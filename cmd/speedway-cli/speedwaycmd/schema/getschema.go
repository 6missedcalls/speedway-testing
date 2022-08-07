package schema

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/denisbrodbeck/machineid"
	"github.com/manifoldco/promptui"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	st "github.com/sonr-io/sonr/x/schema/types"
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
			// load keys
			aesKey, err := loadKey("AES.key")
			if aesKey == nil || len(aesKey) != 32 {
				fmt.Println(chalk.Yellow.Color("Please provide a valid aesKey"))
			}
			if err != nil {
				fmt.Println(chalk.Yellow.Color("Please provide a valid pskKey"))
			}
			pskKey, err := loadKey("PSK.key")
			if pskKey == nil || len(pskKey) != 32 {
				fmt.Println(chalk.Yellow.Color("Please provide a valid pskKey"))
			}
			if err != nil {
				fmt.Println(chalk.Yellow.Color("Please provide a valid pskKey"))
			}
			// get hwid
			hwid, err := machineid.ID()
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			// create new motor
			m := mtr.EmptyMotor(hwid)
			// create login request
			loginReq := &rtmv1.LoginRequest{
				Did:       did,
				AesDscKey: aesKey,
				AesPskKey: pskKey,
			}
			// login
			loginRes, err := m.Login(*loginReq)
			if loginRes.Success {
				fmt.Println(chalk.Green.Color("Login successful"))
			} else {
				fmt.Println(chalk.Red.Color("Login failed"))
			}
			if err != nil {
				fmt.Printf("Prompt failed %v\n", err)
				return
			}
			fmt.Println("loginRes", loginRes)
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

			// marshall request
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
			fmt.Printf("%+v\n", whatIs)
			// take cid from result and query
			cid := whatIs.Schema.Cid
			fmt.Println(chalk.Green.Color, "Field CID:", cid)
			// create a new get request to ipfs.sonr.ws with cid
			getReq, err := http.NewRequest("GET", "https://ipfs.sonr.ws/ipfs/"+cid, nil)
			if err != nil {
				fmt.Printf("NewRequest failed %v\n", err)
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
			// print response body
			fmt.Printf("%s\n", body)
		},
	}
	return
}
