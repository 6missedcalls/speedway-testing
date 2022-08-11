package resolver

import (
	"fmt"
	"io/ioutil"
	"net/http"

	st "github.com/sonr-io/sonr/x/schema/types"
	"github.com/ttacon/chalk"
)

// Unmarshal WhatIs and return a QueryWhatIsResponse
func DeserializeWhatIs(whatis []byte) *st.WhatIs {
	whatIs := &st.WhatIs{}
	err := whatIs.Unmarshal(whatis)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		panic(err)
	}
	fmt.Println(chalk.Blue, "Schema:", whatIs.Schema)
	return whatIs
}

func ResolveIPFS(cid string) (st.SchemaDefinition, error) {
	getReq, err := http.NewRequest("GET", "https://ipfs.sonr.ws/ipfs/"+cid, nil)
	if err != nil {
		fmt.Printf("Request to IPFS failed %v\n", err)
	}
	// get the file from ipfs.sonr.ws
	resp, err := http.DefaultClient.Do(getReq)
	if err != nil {
		fmt.Printf("Do failed %v\n", err)
	}
	// read the file
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("ReadAll failed %v\n", err)
	}
	definition := &st.SchemaDefinition{}
	if err = definition.Unmarshal(body); err != nil {
		fmt.Printf("error unmarshalling body: %s", err)
	}
	// print response
	return *definition, err
}
