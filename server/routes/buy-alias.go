package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	rt "github.com/sonr-io/sonr/x/registry/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type BuyAliasBody struct {
	Creator string `json:"creator"`
	Alias   string `json:"alias"`
}

// @BasePath /api/v1
// @Summary BuyAlias
// @Schemes
// @Description Buy an alias
// @Tags Alias
// @Accept json
// @Produce json
// @Param creator body string true "Creator"
// @Param alias body string true "Alias"
// @Success 200 {object} rt.MsgBuyAliasResponse
// @Failure      500  {object}  FailedResponse
// @Router /alias/buy [post]
func (ns *NebulaServer) BuyAlias(c *gin.Context) {
	var body BuyAliasBody
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}
	m := binding.CreateInstance()
	msg := rt.MsgBuyAlias{
		Creator: body.Creator,
		Name:    body.Alias,
	}
	res, err := m.BuyAlias(context.Background(), msg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}