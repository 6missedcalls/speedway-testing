package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/did"
	"github.com/sonr-io/speedway/internal/binding"
)

type uResponse struct {
	Address     string
	DidDocument did.Document
}

// @BasePath /api/v1
// @Summary GetAccount
// @Schemes
// @Description Get Account information from the Sonr Blockchain. This is a read-only endpoint.
// @Tags object
// @Produce json
// @Success 200 {object} uResponse
// @Failure      500  {string}  message
// @Router /account/info [get]
func (ns *NebulaServer) GetAccount(c *gin.Context) {
	m := binding.CreateInstance()
	if m == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Motor Instance failed",
		})
		return
	}

	addr, err := m.GetAddress()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Get Address from Motor failed",
		})
		return
	}

	didDocument, err := m.GetDidDocument()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Get DidDocument from Motor failed",
		})
		return
	}
	res := uResponse{
		Address:     addr,
		DidDocument: *didDocument,
	}
	c.JSON(http.StatusOK, res)
}
