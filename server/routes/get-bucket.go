package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type GetBucketBody struct {
	Did string `json:"did"` // DID of the bucket
}

type GetBucketResponse struct {
	Bucket []*types.BucketItem `json:"bucket"`
}

// @BasePath /api/v1
// @Summary GetBucket
// @Schemes
// @Description Get a bucket on Sonr using the bucket module of Sonr's Blockchain.
// @Tags bucket
// @Produce json
// @Param 		 bucketDid body string true "BucketDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Success 200 {object} GetBucketResponse
// @Failure      500  {object} FailedResponse
// @Router /bucket/get [post]
func (ns *NebulaServer) GetBucket(c *gin.Context) {
	rBody := c.Request.Body
	var body GetBucketBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
		})
		return
	}

	b := binding.CreateInstance()

	bucket, err := b.GetBuckets(context.Background(), body.Did)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to get bucket",
		})
		return
	}

	c.JSON(http.StatusOK,
		GetBucketResponse{
			Bucket: bucket,
		})
}
