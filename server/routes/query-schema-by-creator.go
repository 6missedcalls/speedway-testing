package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/speedway/internal/binding"
)

// @BasePath /api/v1
// @Summary QueryWhatIsByCreator
// @Schemes
// @Description Query the Sonr Blockchain for all public schemas on the Blockchain. This is a read-only endpoint.
// @Tags Schema
// @Produce json
// @Param creator query string false "did:snr:..."
// @Param pagination query string false "pagination"
// @Success 200 {object} rtmv1.QueryWhatIsByCreatorResponse
// @Failure      500  {object} FailedResponse
// @Router /schema/get-from-creator [post]
func (ns *NebulaServer) QuerySchemaByCreator(c *gin.Context) {
	rb := c.Request.Body
	var body rtmv1.QueryWhatIsByCreatorRequest
	err := json.NewDecoder(rb).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "QueryWhatIsByCreatorRequest Could not be parsed",
		})
		return
	}

	b := binding.CreateInstance().Instance
	res, err := b.QueryWhatIsByCreator(rtmv1.QueryWhatIsByCreatorRequest{
		Creator: body.Creator,
	})
	if err != nil {
		// ! Issue: If a specific creator has no schemas, this will return an error.
		// ! This is not the desired behavior.
		// ! Here is a temporary solution to describe the error to the user.
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "This user has no schemas or the creator is invalid.",
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
