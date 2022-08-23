package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/utils"
)

type QuerySchema struct {
	Creator string `json:"creator"`
	Schema  string `json:"schema"`
}

// @BasePath /api/v1
// @Summary GetSchema
// @Schemes
// @Description Get a schema utilizing motor client. Returns the WhatIs of the schema that is retrieved.
// @Tags schema
// @Produce json
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

	m := binding.CreateInstance()

	ctx := context.Background()

	schema, err := m.GetSchema(ctx, r.Creator, r.Schema)
	if schema.WhatIs == nil {
		fmt.Printf("GetSchema failed %v\n", err)
		return
	}

	definition, err := utils.ResolveIPFS(schema.WhatIs.Schema.Cid)
	if err != nil {
		fmt.Printf("ResolveIPFS failed %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error resolving IPFS",
		})
		return
	}

	c.JSON(http.StatusOK, definition)
}
