package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	rt "github.com/sonr-io/sonr/x/registry/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type SellAliasBody struct {
	Creator string `json:"creator"`
	Alias   string `json:"alias"`
	Amount  int32  `json:"amount"`
}

// @BasePath /api/v1
// @Summary SellAlias
// @Schemes
// @Description Sell an alias
// @Tags Alias
// @Accept json
// @Produce json
// @Param creator body string true "Creator"
// @Param alias body string true "Alias"
// @Param amount body int32 true "Amount"
// @Success 200 {object} rt.MsgSellAliasResponse
// @Failure      500  {object}  FailedResponse
// @Router /alias/sell [post]
func (ns *NebulaServer) SellAlias(c *gin.Context) {
	var body SellAliasBody
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}
	m := binding.CreateInstance()
	msg := rt.MsgSellAlias{
		Creator: body.Creator,
		Alias:   body.Alias,
		Amount:  body.Amount,
	}
	res, err := m.SellAlias(context.Background(), msg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
