package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	btv1 "github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type GetBucketBody struct {
	BucketDid string `json:"bucketDid"` // DID of the bucket
}

type GetBucketResponse struct {
	Bucket []*ConvertBucketRes `json:"bucket"`
}

type ConvertBucketRes struct {
	Name      string              `json:"name"`
	Uri       string              `json:"uri"`
	Timestamp int64               `json:"timestamp"`
	SchemaDid string              `json:"schemaDid"`
	Content   *btv1.BucketContent `json:"content"`
}

// @BasePath /api/v1
// @Summary GetBucket
// @Schemes
// @Description Get a bucket on Sonr using the bucket module of Sonr's Blockchain.
// @Tags Bucket
// @Accept json
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

	bucket, err := b.GetBuckets(context.Background(), body.BucketDid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	var res []*ConvertBucketRes

	// for each bucketitem in bucket get the content
	for _, bucketItem := range bucket {
		content, err := b.GetContentById(context.Background(), body.BucketDid, bucketItem.Uri)
		if err != nil {
			c.JSON(http.StatusInternalServerError, FailedResponse{
				Error: err.Error(),
			})
			return
		}
		ConvertBucketRes := ConvertBucketRes{
			Name:      bucketItem.Name,
			Uri:       bucketItem.Uri,
			Timestamp: bucketItem.Timestamp,
			SchemaDid: bucketItem.SchemaDid,
			Content:   content,
		}
		res = append(res, &ConvertBucketRes)
	}

	c.JSON(http.StatusOK, GetBucketResponse{
		Bucket: res,
	})
}
