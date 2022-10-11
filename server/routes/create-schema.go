package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/schema/types"
)

type CreateSchemaRequest struct {
	SchemaLabel string                            `json:"label"`    // Label of the schema
	SchemaField map[string]*types.SchemaFieldKind `json:"fields"`   // Fields of the schema
	Metadata    map[string]string                 `json:"metadata"` // Metadata of the schema
}

// @BasePath /api/v1
// @Summary CreateSchema
// @Schemes
// @Description Create a schema utilizing motor client. Returns the WhatIs of the schema created.
// @Tags Schema
// @Accept json
// @Produce json
// @Param label query string true "Label of the schema"
// @Param fields query string true "Fields of the schema"
// @Success 	 200  {object}  rtmv1.CreateSchemaResponse
// @Failure      500  {object}  FailedResponse
// @Router /schema/create [post]
func (ns *NebulaServer) CreateSchema(c *gin.Context) {
	var body CreateSchemaRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	// Create a new create schema request
	createSchemaReq := rtmv1.CreateSchemaRequest{
		Label:  body.SchemaLabel,
		Fields: body.SchemaField,
	}

	b := ns.Config.Binding

	// create the schema
	res, err := b.CreateSchema(createSchemaReq)
	if err != nil {
		fmt.Println("Create Schema Error: ", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
