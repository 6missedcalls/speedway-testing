package routes

import (
	"net/http"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/x/schema/types"
)

type CreateSchemaDocumentRequest struct {
	Creator    string `json:"creator"`
	Label      string `json:"label"`
	Definition *types.SchemaDefinition
	Fields     []*types.SchemaDocumentValue
}

// @BasePath /api/v1
// @Summary CreateSchemaDocument
// @Schemes
// @Description Create a new schema document on Sonr using the Registry module of Sonr's Blockchain.
// @Tags Schema
// @Accept json
// @Produce json
// @Param 		 creator body string true "creator" example("did:sonr:0x1234")
// @Param 		 label body string true "label" example("My Schema")
// @Param 		 definition body string true "definition" example("did:sonr:0x1234")
// @Param 		 fields body string true "fields" example("did:sonr:0x1234")
// @Success 	 200  {object}  rtmv1.UploadDocumentResponse
// @Failure      500  {object}  FailedResponse
// @Router /schema/create [post]
func (ns *NebulaServer) CreateSchemaDocument(c *gin.Context) {
	var body CreateSchemaDocumentRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	req := rtmv1.UploadDocumentRequest{
		Creator:    body.Creator,
		Label:      body.Label,
		Definition: body.Definition,
		Fields:     body.Fields,
	}

	b := binding.CreateInstance()

	res, err := b.CreateSchemaDocument(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, rtmv1.UploadDocumentResponse{
		Status:   res.Status,
		Did:      res.Did,
		Cid:      res.Cid,
		Document: res.Document,
	})
}
