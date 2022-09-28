package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/did"
)

type uResponse struct {
	Address     string
	DidDocument did.Document
}

// @BasePath /api/v1
// @Summary GetAccount
// @Schemes
// @Description Get Account information from the Sonr Blockchain. This is a read-only endpoint.
// @Tags Account
// @Accept json
// @Produce json
// @Success 200 {object} uResponse
// @Failure      500  {object} FailedResponse
// @Router /account/info [get]
func (ns *NebulaServer) GetAccount(c *gin.Context) {
	m := ns.Config.Binding
	if m == nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to create binding instance",
		})
		return
	}

	addr := m.Instance.GetAddress()
	didDocument := m.Instance.GetDIDDocument()

	res := uResponse{
		Address:     addr,
		DidDocument: didDocument,
	}

	c.JSON(http.StatusOK, res)
}
