package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/utils"
)

type UpdateBucketRequest struct {
	BucketDid string              `json:"bucketDid"`
	Content   []map[string]string `json:"content"`
}

// @BasePath /api/v1
// @Summary UpdateBucketItems
// @Schemes
// @Description Update a bucket on Sonr using the bucket module of Sonr's Blockchain.
// @Tags Bucket
// @Produce json
// @Param 		 bucketDid body string true "BucketDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 Content body string true "Content" example("name: My Bucket, uri: bafyreifqum26tv4wprgri5t4ddef7tozknnicuayjcvd4m5gag5avgtvsa")
// @Success 200 {object} types.BucketItem
// @Failure      500  {object}  FailedResponse
// @Router /bucket/update-items [post]
func (ns *NebulaServer) UpdateBucketItems(c *gin.Context) {
	var body UpdateBucketRequest
	err := c.BindJSON(&body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	var content []*types.BucketItem
	for _, item := range body.Content {
		rid, err := utils.ConvertResourceIdentifier(item["type"])
		if err != nil {
			c.JSON(http.StatusBadRequest, FailedResponse{
				Error: "Invalid Conversion of ResourceIdentifier",
			})
			return
		}

		content = append(content, &types.BucketItem{
			Name:      item["name"],
			Uri:       item["uri"],
			Timestamp: time.Now().Unix(),
			Type:      rid,
			SchemaDid: item["schemaDid"],
		})
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
	updateContent, err := b.UpdateBucketItems(context.Background(), body.BucketDid, content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, updateContent)
}
