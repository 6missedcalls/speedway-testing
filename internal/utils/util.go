package utils

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/denisbrodbeck/machineid"
	st "github.com/sonr-io/sonr/x/schema/types"
)

// GetHWID returns the hardware ID of the machine.
func GetHwid() string {
	hwid, err := machineid.ID()
	if err != nil {
		return "Error getting hwid"
	}
	return hwid
}

// Unmarshal WhatIs and return a QueryWhatIsResponse
func DeserializeWhatIs(whatis []byte) *st.WhatIs {
	whatIs := &st.WhatIs{}
	err := whatIs.Unmarshal(whatis)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		panic(err)
	}
	return whatIs
}

// ResolveIPFS returns the schema definition of the given CID.
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
