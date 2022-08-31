package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/binding"
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
// @Tags bucket
// @Produce json
// @Param 		 bucketDid body string true "BucketDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 Content body string true "Content" example("name: My Bucket, uri: bafyreifqum26tv4wprgri5t4ddef7tozknnicuayjcvd4m5gag5avgtvsa")
// @Success 200 {object} types.BucketItem
// @Failure      500  {object}  FailedResponse
// @Router /bucket/update-items [post]
func (ns *NebulaServer) UpdateBucketItems(c *gin.Context) {
	rBody := c.Request.Body
	var r UpdateBucketRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	var content []*types.BucketItem
	for _, item := range r.Content {
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
	updateContent, err := b.UpdateBucketItems(context.Background(), r.BucketDid, content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Update Bucket Error",
		})
		return
	}

	c.JSON(http.StatusOK, updateContent)
}
