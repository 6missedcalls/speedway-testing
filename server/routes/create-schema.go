package nebula

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

// create a struct to hold the command line flags for the command
type CreateSchemaRequest struct {
	Did          string `json:"did"`
	Password     string `json:"password"`
	SchemaLabel  string `json:"label"`
	SchemaFields string `json:"fields"`
	// make Schema Fields
}

func (ns *NebulaServer) CreateSchema(c *gin.Context) {
	rBody := c.Request.Body
	var r CreateSchemaRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	m := mtr.EmptyMotor("Test_Device")
	// TODO: Call login from registry service
	aesPskKey, err := loadKey("./PSK.key")
	if err != nil {
		fmt.Println("err", err)
	}
	// * Create a new login & create schema request
	// Create a new login request
	loginRequest := (rtmv1.LoginRequest{
		Did:       r.Did,
		Password:  r.Password,
		AesPskKey: aesPskKey,
	})
	loginResponse, err := m.Login(loginRequest)
	// if login fails, return error
	if loginResponse.Success != true {
		c.JSON(400, gin.H{
			"error": "Login failed",
		})
		return
	}
	fmt.Println("loginResponse", loginResponse)
	// Create a new create schema request
	createSchemaRequest := (rtmv1.CreateSchemaRequest{
		Label: r.SchemaLabel,
		Fields: map[string]rtmv1.CreateSchemaRequest_SchemaKind{
			"hello": rtmv1.CreateSchemaRequest_SCHEMA_KIND_STRING,
		},
	})

	fmt.Println("createSchemaRequest", createSchemaRequest)
	// Create a new motor client and login

	// create the schema
	res, err := m.CreateSchema(createSchemaRequest)
	if err != nil {
		fmt.Println("Create Schema Error: ", err)
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"schema": res,
	})
}
