package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/binding"
)

type GetBucketBody struct {
	Did string `json:"did"` // did of the bucket
}

// @BasePath /api/v1
// @Summary GetBucket
// @Schemes
// @Description Get a bucket on Sonr using the object module of Sonr's Blockchain.
// @Tags bucket
// @Produce json
// @Param 		 bucketDid body string true "BucketDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Success 200 {object} bucket.BucketReference
// @Failure      500  {string}  message
// @Router /bucket/get [post]
func (ns *NebulaServer) GetBucket(c *gin.Context) {
	rBody := c.Request.Body
	var body GetBucketBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	// init motor
	b := binding.CreateInstance()

	bucket, err := b.GetBucket(context.Background(), body.Did)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get bucket",
		})
		return
	}

	c.JSON(http.StatusOK, bucket)
}
