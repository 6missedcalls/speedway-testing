package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/utils"
)

type QuerySchema struct {
	Creator string `json:"creator"`
	Schema  string `json:"schema"`
}

type QuerySchemaResponse struct {
	Definition *types.SchemaDefinition `json:"definition"`
}

// @BasePath /api/v1
// @Summary GetSchema
// @Schemes
// @Description Get a schema utilizing motor client. Returns the WhatIs of the schema that is retrieved.
// @Tags Schema
// @Accept json
// @Produce json
// @Param creator body string true "Creator"
// @Param schema body string true "Schema"
// @Success      200  {object} QuerySchemaResponse
// @Failure      500  {object} FailedResponse
// @Router /schema/get [post]
func (ns *NebulaServer) QuerySchema(c *gin.Context) {
	rBody := c.Request.Body
	var r QuerySchema
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid Request Body",
		})
		return
	}

	m := binding.CreateInstance()

	ctx := context.Background()

	schema, err := m.GetSchema(ctx, r.Creator, r.Schema)
	if schema.WhatIs == nil {
		fmt.Printf("GetSchema failed %v\n", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	definition, err := utils.ResolveIPFS(schema.WhatIs.Schema.Cid)
	if err != nil {
		fmt.Printf("ResolveIPFS failed %v\n", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Resolve IPFS failed",
		})
		return
	}

	c.JSON(http.StatusOK,
		QuerySchemaResponse{
			Definition: &definition,
		})
}
