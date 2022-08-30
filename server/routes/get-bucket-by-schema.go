package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/speedway/internal/binding"
)

type GetBucketBySchemaBody struct {
	Creator   string `json:"creator"`   // Address of the creator
	BucketDid string `json:"bucketDid"` // DID of the bucket
	SchemaDid string `json:"schemaDid"` // DID of the schema
}

// @BasePath /api/v1
// @Summary GetBucketBySchema
// @Schemes
// @Description Get a bucket on Sonr using a Schema.
// @Tags bucket
// @Produce json
// @Param 		 Creator body string true "Creator" example("snr172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 BucketDid body string true "bucketDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 SchemaDid body string true "schemaDid" example("did:snr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Success 200 {object} rtmv1.SearchBucketContentBySchemaResponse
// @Failure      500  {object}  FailedResponse
// @Router /bucket/get-by-schema [post]
func (ns *NebulaServer) GetBucketBySchema(c *gin.Context) {
	rBody := c.Request.Body
	var body GetBucketBySchemaBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
		})
		return
	}

	b := binding.CreateInstance()

	req := rtmv1.SeachBucketContentBySchemaRequest{
		Creator:   body.Creator,
		BucketDid: body.BucketDid,
		SchemaDid: body.SchemaDid,
	}

	bucket, err := b.GetBucketFromSchema(context.Background(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to get bucket",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"bucket": bucket,
	})
}
