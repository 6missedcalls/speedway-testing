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
// @Summary QueryBuckets
// @Schemes
// @Description Query the Sonr Blockchain for all public buckets by a specified creator.
// @Tags Proxy
// @Produce json
// @Param creator query string false "creator"
// @Param pagination query string false "pagination"
// @Success 200 {object} BucketResponse
// @Failure      500  {object} FailedResponse
// @Router /bucket/query [get]
func (ns *NebulaServer) QueryBucketByCreator(c *gin.Context) {
	rBody := c.Request.Body
	var body rtmv1.QueryWhereIsByCreatorRequest
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
		})
		return
	}

	b := binding.CreateInstance().Instance
	res, err := b.QueryWhereIsByCreator(rtmv1.QueryWhereIsByCreatorRequest{
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
