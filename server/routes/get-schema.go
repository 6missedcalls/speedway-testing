package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
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

	schema, err := m.GetSchema(rtmv1.QueryWhatIsRequest{
		Creator: r.Creator,
		Did:     r.Schema,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}
	if schema.WhatIs == nil {
		fmt.Printf("GetSchema failed %v\n", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK,
		QuerySchemaResponse{
			Definition: schema.WhatIs.Schema,
		})
}
