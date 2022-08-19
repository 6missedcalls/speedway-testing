package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/binding"
)

// @BasePath /api/v1
// @Summary GetObject
// @Schemes
// @Description Get an object on Sonr using the object module of Sonr's Blockchain.
// @Tags object
// @Produce json
// @Param 		 SchemaDid body string true "SchemaDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 ObjectCid body string true "ObjectCid" example("bafyreigfzxrtvfzuaoyhn5vgndneeeirq62efgf2s3igmoenxgx7jxy2cm")
// @Success 200 {object} object.ObjectReference
// @Failure      500  {string}  message
// @Router /object/get [post]
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

	DidDoc, err := m.GetDidDocument()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Get DidDocument from Motor failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": addr,
		"did":     DidDoc,
	})
}
