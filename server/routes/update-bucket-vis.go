package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/utils"
)

type UpdateBucketVisibilityRequest struct {
	BucketDid  string `json:"bucketDid"`  // DID of the bucket
	Visibility string `json:"visibility"` // Visibility of the bucket
}

// @BasePath /api/v1
// @Summary UpdateBucketVisibility
// @Schemes
// @Description Update a bucket on Sonr using the bucket module of Sonr's Blockchain.
// @Tags Bucket
// @Produce json
// @Param 		 bucketDid body string true "BucketDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 visibility body string true "Visibility" example("public")
// @Success 200 {object} bucket.Bucket
// @Failure      500  {object}  FailedResponse
// @Router /bucket/update-visibility [post]
func (ns *NebulaServer) UpdateBucketVisibility(c *gin.Context) {
	rBody := c.Request.Body
	var r UpdateBucketVisibilityRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	vis, err := utils.ConvertBucketVisibility(r.Visibility)
	if err != nil {
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid Conversion of Visibility",
		})
		return
	}

	b := binding.CreateInstance()

	// Get the bucket (this is a temporary solution)
	bucket, err := b.GetBuckets(context.Background(), r.BucketDid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to get bucket",
		})
		return
	}
	fmt.Println("Bucket: ", bucket)

	// Update the bucket's Content
	updateContent, err := b.UpdateBucketVisibility(context.Background(), r.BucketDid, &vis)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, updateContent)
}
