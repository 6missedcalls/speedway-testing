package routes

import (
	"net/http"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"

	"github.com/gin-gonic/gin"
)

type GetSchemaDocumentRequest struct {
	Cid string `json:"cid"`
}

func (ns *NebulaServer) GetSchemaDocument(c *gin.Context) {
	var body GetSchemaDocumentRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	b := binding.CreateInstance()

	req := rtmv1.GetDocumentRequest{
		Cid: body.Cid,
	}

	res, err := b.GetSchemaDocument(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
