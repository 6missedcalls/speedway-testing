package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/resolver"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type CreateSchemaRequest struct {
	Address     string                                          `json:"address"` // DID of the user
	SchemaLabel string                                          `json:"label"`   // Label of the schema
	SchemaField map[string]rtmv1.CreateSchemaRequest_SchemaKind `json:"fields"`  // Fields of the schema
}

// @BasePath /api/v1
// @Summary CreateSchema
// @Schemes
// @Description Create a schema utilizing motor client. Returns the WhatIs of the schema created.
// @Tags schema
// @Produce json
// @Param address query string true "Address of the user"
// @Param label query string true "Label of the schema"
// @Param fields query string true "Fields of the schema"
// @Success 	 200  {object}  rtmv1.CreateSchemaResponse
// @Failure      500  {string}  message
// @Router /schema/create [post]
func (ns *NebulaServer) CreateSchema(c *gin.Context) {
	rBody := c.Request.Body
	var r CreateSchemaRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	m := initmotor.InitMotor()

	aesKey, err := storage.LoadKey("aes.key")
	if err != nil {
		fmt.Println("err", err)
	}
	aesPskKey, err := storage.LoadKey("psk.key")
	if err != nil {
		fmt.Println("err", err)
	}
	// * Create a new login & create schema request
	// Create a new login request
	loginRequest := (rtmv1.LoginRequest{
		Did:       r.Address,
		AesDscKey: aesKey,
		AesPskKey: aesPskKey,
	})
	// Login Response
	loginResponse, err := m.Login(loginRequest)
	if err != nil {
		fmt.Println("err", err)
		return
	}
	// if login fails, return error
	if loginResponse.Success {
		fmt.Println(chalk.Green, "Login successful")
	} else {
		fmt.Println(chalk.Red, "Login failed")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Login failed",
		})
		return
	}
	fmt.Println("loginResponse", loginResponse)
	// Create a new create schema request
	createSchemaRequest := rtmv1.CreateSchemaRequest{
		Label:  r.SchemaLabel,
		Fields: r.SchemaField,
	}
	fmt.Println("createSchemaRequest", createSchemaRequest)

	// create the schema
	res, err := m.CreateSchema(createSchemaRequest)
	if err != nil {
		fmt.Println("Create Schema Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	whatIs := resolver.DeserializeWhatIs(res.WhatIs)
	definition, err := resolver.ResolveIPFS(whatIs.Schema.Cid)
	if err != nil {
		fmt.Println("err", err)
		return
	}
	c.JSON(http.StatusOK,
		gin.H{
			"whatIs":     whatIs,
			"definition": definition,
		})
}