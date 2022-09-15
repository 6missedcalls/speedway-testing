package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/denisbrodbeck/machineid"
	"github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/bucket/types"
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

// GetFile reads a file from a given path and return an object builder.
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

/*
	Bucket Utils
*/
// Convert the bucket visibility from a string to the BucketVisibility type.
func ConvertBucketVisibility(visibility string) (types.BucketVisibility, error) {
	var visibilityInt types.BucketVisibility
	switch visibility {
	case "public":
		visibilityInt = types.BucketVisibility_PUBLIC
	case "private":
		visibilityInt = types.BucketVisibility_PRIVATE
	}

	return visibilityInt, nil
}

// Convert the bucket role from a string to the BucketRole type.
func ConvertBucketRole(role string) (types.BucketRole, error) {
	var roleInt types.BucketRole
	switch role {
	case "application":
		roleInt = types.BucketRole_APPLICATION
	case "private":
		roleInt = types.BucketRole_USER
	}

	return roleInt, nil
}

// Convert the bucket content resource identifier from a string to the ResourceIdentifier type.
func ConvertResourceIdentifier(resourceIdentifier string) (types.ResourceIdentifier, error) {
	var rType types.ResourceIdentifier
	switch resourceIdentifier {
	case "did":
		rType = types.ResourceIdentifier_DID
	case "cid":
		rType = types.ResourceIdentifier_CID
	}

	return rType, nil
}

/*
	CMD Utils
*/
func CreateAccount(m motor.MotorNode, req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("Create Account Error: ", err)
		return res, err
	}

	// psk, err := storage.Store("psk", res.AesPsk)
	// if err != nil {
	// 	fmt.Println("Store Key Error: ", err)
	// 	return res, err
	// }
	// fmt.Println("PSK: ", psk)

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

func LoadObjectDefinitionFromDisk(path string) (map[string]interface{}, error) {
	file, err := ioutil.ReadFile(path)

	if err != nil {
		return nil, err
	}

	fields := make(map[string]interface{})
	err = json.Unmarshal(file, &fields)

	if err != nil {
		return nil, err
	}

	return fields, nil
}

func LoadSchemaFieldDefinitionFromDisk(path string) (rtmv1.CreateSchemaRequest, error) {
	file, err := ioutil.ReadFile(path)

	if err != nil {
		return rtmv1.CreateSchemaRequest{}, err
	}

	req := rtmv1.CreateSchemaRequest{}

	err = json.NewDecoder(bytes.NewReader(file)).Decode(&req)

	if err != nil {
		return rtmv1.CreateSchemaRequest{}, err
	}

	return req, nil
}

func ConvertSchemaKind(kind string) (st.SchemaKind, error) {

	schemaKind := st.SchemaKind_STRING
	switch kind {
	case "LIST":
		schemaKind = st.SchemaKind_LIST
	case "BOOL":
		schemaKind = st.SchemaKind_BOOL
	case "INT":
		schemaKind = st.SchemaKind_INT
	case "FLOAT":
		schemaKind = st.SchemaKind_FLOAT
	case "STRING":
		schemaKind = st.SchemaKind_STRING
	case "BYTES":
		schemaKind = st.SchemaKind_BYTES
	case "LINK":
		schemaKind = st.SchemaKind_LINK
	}

	return schemaKind, nil
}

func MarshalJsonFmt(data interface{}) (string, error) {
	b, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return "", err
	}

	return string(b), err
}
