package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

// @BasePath /api/v1
// @Summary QueryWhatIsByCreator
// @Schemes
// @Description Query the Sonr Blockchain for all public schemas on the Blockchain. This is a read-only endpoint.
// @Tags Schema
// @Produce json
// @Success 200 {object} SchemaResponse
// @Failure      500  {object} FailedResponse
// @Router /schema/get-from-creator [get]
func (ns *NebulaServer) QuerySchemaByCreator(c *gin.Context) {
	var body rtmv1.QueryWhatIsByCreatorRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	b := ns.Config.Binding
	res, err := b.Instance.QueryWhatIsByCreator(rtmv1.QueryWhatIsByCreatorRequest{
		Creator: body.Creator,
	})
	if err != nil {
		// TODO: Add proper error message
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
