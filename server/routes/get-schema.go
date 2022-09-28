package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

type QuerySchema struct {
	Creator string `json:"creator"`
	Schema  string `json:"schema"`
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
// @Success      200  {object} rtmv1.QueryWhatIsResponse
// @Failure      500  {object} FailedResponse
// @Router /schema/get [post]
func (ns *NebulaServer) QuerySchema(c *gin.Context) {
	var body QuerySchema
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	b := ns.Config.Binding

	res, err := b.Instance.QueryWhatIs(rtmv1.QueryWhatIsRequest{
		Creator: body.Creator,
		Did:     body.Schema,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}
	if res.WhatIs == nil {
		fmt.Printf("GetSchema failed %v\n", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
