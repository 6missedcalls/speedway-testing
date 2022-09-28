package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/binding"
)

// @BasePath /api/v1
// @Summary QueryWhereIsByCreator
// @Schemes
// @Description Query the Sonr Blockchain for all public buckets by a specified creator.
// @Tags Bucket
// @Produce json
// @Param creator query string false "snr..."
// @Param pagination query string false "pagination"
// @Success 200 {object} rtmv1.QueryWhereIsByCreatorResponse
// @Failure      500  {object} FailedResponse
// @Router /bucket/get-from-creator [post]
func (ns *NebulaServer) QueryBucketByCreator(c *gin.Context) {
	rBody := c.Request.Body
	var body rtmv1.QueryWhereIsByCreatorRequest
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "QueryWhereIsByCreatorRequest Could not be parsed",
		})
		return
	}

	b := binding.CreateInstance().Instance
	res, err := b.QueryWhereIsByCreator(rtmv1.QueryWhereIsByCreatorRequest{
		Creator: body.Creator,
	})
	if err != nil {
		// * Note: If a specific creator has not created a bucket
		// * this will return the QueryWhereIsByCreatorResponse with a code of 202.
		// * This is the desired behavior.
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
