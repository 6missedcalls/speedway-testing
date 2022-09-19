package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	rt "github.com/sonr-io/sonr/x/registry/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type TransferAliasBody struct {
	Creator   string `json:"creator"`
	Alias     string `json:"alias"`
	Recipient string `json:"recipient"`
	Amount    int32  `json:"amount"`
}

// @BasePath /api/v1
// @Summary TransferAlias
// @Schemes
// @Description Transfer an alias
// @Tags Alias
// @Accept json
// @Produce json
// @Param creator body string true "Creator"
// @Param alias body string true "Alias"
// @Param recipient body string true "Recipient"
// @Param amount body int32 true "Amount"
// @Success 200 {object} rt.MsgTransferAliasResponse
// @Failure      500  {object}  FailedResponse
// @Router /alias/transfer [post]
func (ns *NebulaServer) TransferAlias(c *gin.Context) {
	var body TransferAliasBody
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}
	m := binding.CreateInstance()
	msg := rt.MsgTransferAlias{
		Creator:   body.Creator,
		Alias:     body.Alias,
		Recipient: body.Recipient,
		Amount:    body.Amount,
	}
	res, err := m.TransferAlias(context.Background(), msg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
