package routes

import (
	"net/http"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"

	"github.com/gin-gonic/gin"
)

type GetSchemaDocumentRequest struct {
	Cid string `json:"cid"`
}

// @BasePath /api/v1
// @Summary GetSchemaDocument
// @Schemes
// @Description Get a schema document utilizing motor client. Returns the schema document.
// @Tags Schema Document
// @Accept json
// @Produce json
// @Param cid query string true "Cid of the schema"
// @Success 	 200  {object}  rtmv1.GetDocumentResponse
// @Failure      500  {object}  FailedResponse
// @Router /schema-document/get [post]
func (ns *NebulaServer) GetSchemaDocument(c *gin.Context) {
	var body GetSchemaDocumentRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	b := ns.Config.Binding

	req := rtmv1.GetDocumentRequest{
		Cid: body.Cid,
	}

	res, err := b.Instance.GetDocument(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
