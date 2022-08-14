package routes

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/resolver"
	"github.com/sonr-io/speedway/internal/retrieve"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type QuerySchema struct {
	Address string `json:"address"`
	Creator string `json:"creator"`
	Schema  string `json:"schema"`
}

// @BasePath /api/v1
// @Summary GetSchema
// @Schemes
// @Description Get a schema utilizing motor client. Returns the WhatIs of the schema that is retrieved.
// @Tags schema
// @Produce json
// @Param did query string true "Did"
// @Param creator query string true "Creator"
// @Param schema query string true "Schema"
// @Success      200  {object} types.SchemaDefinition
// @Failure      500  {string} message error
// @Router /schema/get [post]
func (ns *NebulaServer) QuerySchema(c *gin.Context) {
	rBody := c.Request.Body
	var r QuerySchema
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	m := initmotor.InitMotor()

	// TODO: Call login from registry service
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
	loginRequest := rtmv1.LoginRequest{
		Did:       r.Address,
		AesDscKey: aesKey,
		AesPskKey: aesPskKey,
	}

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
		c.JSON(500, gin.H{
			"error": "Login failed",
		})
		return
	}
	fmt.Println("loginResponse", loginResponse)

	schema, err := retrieve.GetSchema(m, r.Creator, r.Schema)
	if schema.WhatIs == nil {
		fmt.Printf("Command failed %v\n", err)
		return
	}
	fmt.Println("schema", schema)
	whatIs := resolver.DeserializeWhatIs(schema.WhatIs)
	definition, err := resolver.ResolveIPFS(whatIs.Schema.Cid)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return
	}

	c.JSON(200, definition)
}
