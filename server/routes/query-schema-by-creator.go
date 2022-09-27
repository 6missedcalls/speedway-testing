package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"
)

// @BasePath /api/v1
// @Summary QuerySchemas
// @Schemes
// @Description Query the Sonr Blockchain for all public schemas on the Blockchain. This is a read-only endpoint.
// @Tags Schema
// @Produce json
// @Success 200 {object} SchemaResponse
// @Failure      500  {object} FailedResponse
// @Router /schema/query [get]
func (ns *NebulaServer) QuerySchemaByCreator(c *gin.Context) {
	rb := c.Request.Body
	var body rtmv1.QueryWhatIsByCreatorRequest
	err := json.NewDecoder(rb).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
		})
		return
	}

	b := binding.CreateInstance().Instance
	res, err := b.QueryWhatIsByCreator(rtmv1.QueryWhatIsByCreatorRequest{
		Creator: body.Creator,
	})
	if err != nil {
		// TODO: Add proper error message
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, rtmv1.QueryWhatIsByCreatorResponse{
		Code:       res.Code,
		WhatIs:     res.WhatIs,
		Schemas:    res.Schemas,
		Pagination: res.Pagination,
	})
}
