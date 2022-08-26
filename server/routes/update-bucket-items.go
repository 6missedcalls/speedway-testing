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

type UpdateBucketRequest struct {
	Did        string                    `json:"did"`
	Content    map[string]string         `json:"content"`
	ResourceId *types.ResourceIdentifier `json:"resourceId"`
}

// @BasePath /api/v1
// @Summary UpdateBucket
// @Schemes
// @Description Create a bucket on Sonr using the object module of Sonr's Blockchain.
// @Tags bucket
// @Produce json
// @Param body body UpdateBucketRequest true "UpdateBucketRequest" example("{\"creator\":\"did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p\",\"did\":\"did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p\",\"label\":\"My Bucket\",\"visibility\":\"public\",\"role\":\"application\",\"content\":{\"key\":\"value\"}}")
// @Success 200 {object} bucket.Bucket
// @Failure      500  {string}  message
// @Router /bucket/create [post]
func (ns *NebulaServer) UpdateBucket(c *gin.Context) {
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

	items := make([]*types.BucketItem, 0)
	// add the name, uri and type to the items array
	items = append(items, &types.BucketItem{
		Name: r.Content["name"],
		Uri:  r.Content["uri"],
	})

	b := binding.CreateInstance()

	// Update the bucket's Content
	updateContent, err := b.UpdateBucketItems(context.Background(), r.Did, items)
	if err != nil {
		fmt.Println("Update Bucket Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could Not Update Bucket",
		})
		return
	}

	c.JSON(http.StatusOK, updateContent)
}
