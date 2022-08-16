package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/retrieve"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/sonr-io/speedway/internal/utils"
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	m := account.InitMotor()

	aesKey, aesPskKey, err := storage.AutoLoadKey()
	if err != nil {
		fmt.Println(chalk.Red.Color("Key Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error Loading Keys",
		})
		return
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
		fmt.Println("Login Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Login Error",
		})
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

	ctx := context.Background()
	schema, err := retrieve.GetSchema(ctx, m, r.Creator, r.Schema)
	if schema.WhatIs == nil {
		fmt.Printf("GetSchema failed %v\n", err)
		return
	}
	whatIs := utils.DeserializeWhatIs(schema.WhatIs)
	definition, err := utils.ResolveIPFS(whatIs.Schema.Cid)
	if err != nil {
		fmt.Printf("ResolveIPFS failed %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error resolving IPFS",
		})
		return
	}

	c.JSON(http.StatusOK, definition)
}
