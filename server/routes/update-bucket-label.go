package routes

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UpdateBucketLabelRequest struct {
	BucketDid string `json:"bucketDid"`
	Label     string `json:"label"`
}

// @BasePath /api/v1
// @Summary UpdateBucketLabel
// @Schemes
// @Description Update a bucket on Sonr using the bucket module of Sonr's Blockchain.
// @Tags Bucket
// @Produce json
// @Param 		 bucketDid body string true "BucketDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 label body string true "Label" example("My Bucket")
// @Success 200 {object} bucket.Bucket
// @Failure      500  {object}  FailedResponse
// @Router /bucket/update-label [post]
func (ns *NebulaServer) UpdateBucketLabel(c *gin.Context) {
	var body UpdateBucketLabelRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	b := ns.Config.Binding

	// Get the bucket (this is a temporary solution)
	bucket, err := b.GetBuckets(context.Background(), body.BucketDid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to get bucket",
		})
		return
	}
	fmt.Println("Bucket: ", bucket)

	// Update the bucket's Content
	updateContent, err := b.UpdateBucketLabel(context.Background(), body.BucketDid, body.Label)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, updateContent)
}
