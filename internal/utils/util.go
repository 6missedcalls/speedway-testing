package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"

	"github.com/denisbrodbeck/machineid"
	"github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/bucket/types"
	st "github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/storage"
)

type ObjectBuilder struct {
	Label  string                 `json:"label"`
	Object map[string]interface{} `json:"object"`
}

/*
	Motor Utils
*/

// GetHWID returns the hardware ID of the machine.
func GetHwid() string {
	hwid, err := machineid.ID()
	if err != nil {
		return "Error getting hwid"
	}
	return hwid
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

func LoadDocumentFieldsFromDisk(path string) ([]*st.SchemaDocumentValue, error) {
	var fields []*st.SchemaDocumentValue = make([]*st.SchemaDocumentValue, 0)
	file, err := ioutil.ReadFile(path)

	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(file, &fields)

	if err != nil {
		return nil, err
	}

	return fields, nil
}

func ConvertSchemaKind(kind string) (st.SchemaKind, error) {
	kind = strings.ToLower(kind)
	schemaKind := st.SchemaKind_STRING
	switch kind {
	case "list":
		schemaKind = st.SchemaKind_LIST
	case "bool":
		schemaKind = st.SchemaKind_BOOL
	case "int":
		schemaKind = st.SchemaKind_INT
	case "float":
		schemaKind = st.SchemaKind_FLOAT
	case "string":
		schemaKind = st.SchemaKind_STRING
	case "bytes":
		schemaKind = st.SchemaKind_BYTES
	case "link":
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
