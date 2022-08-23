package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/pkg/motor/types"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/utils"
)

type CreateSchemaRequest struct {
	SchemaLabel string                      `json:"label"`    // Label of the schema
	SchemaField map[string]types.SchemaKind `json:"fields"`   // Fields of the schema
	Metadata    map[string]string           `json:"metadata"` // Metadata of the schema
}

// @BasePath /api/v1
// @Summary CreateSchema
// @Schemes
// @Description Create a schema utilizing motor client. Returns the WhatIs of the schema created.
// @Tags schema
// @Produce json
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
			"error": "Invalid Request Body",
		})
		return
	}

	// Create a new create schema request
	createSchemaReq := rtmv1.CreateSchemaRequest{
		Label:  r.SchemaLabel,
		Fields: r.SchemaField,
	}

	b := binding.CreateInstance()

	// create the schema
	res, err := b.CreateSchema(createSchemaReq)
	if err != nil {
		fmt.Println("Create Schema Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could Not Create Schema",
		})
		return
	}

	definition, err := utils.ResolveIPFS(res.WhatIs.Schema.Cid)
	if err != nil {
		fmt.Println("err", err)
		return
	}

	c.JSON(http.StatusOK,
		gin.H{
			"whatIs":     res.WhatIs,
			"definition": definition,
		})
}
