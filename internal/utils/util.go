package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/denisbrodbeck/machineid"
	"github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	st "github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
)

type ObjectBuilder struct {
	Label  string                 `json:"label"`
	Object map[string]interface{} `json:"object"`
}

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

func GetFile(path string) (*ObjectBuilder, error) {
	file, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println(status.Error("Error reading file: "), err)
	}

	var objectBuilder ObjectBuilder
	err = json.Unmarshal(file, &objectBuilder)
	if err != nil {
		fmt.Println(status.Error("Error unmarshalling file: "), err)
	}

	return &objectBuilder, err
}

func CreateAccount(m motor.MotorNode, req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("Create Account Error: ", err)
		return res, err
	}

	psk, err := storage.StoreKeyring("psk", res.AesPsk)
	if err != nil {
		fmt.Println("Store Key Error: ", err)
		return res, err
	}
	fmt.Println("PSK: ", psk)

	if storage.StoreInfo("address.snr", m) != nil {
		fmt.Println("Storage Error: ", err)
		return res, err
	}

	return res, err
}

func Login(m motor.MotorNode, req rtmv1.LoginRequest) (rtmv1.LoginResponse, error) {
	res, err := m.Login(req)
	if err != nil {
		fmt.Println("err", err)
		return res, err
	}

	return res, err
}
