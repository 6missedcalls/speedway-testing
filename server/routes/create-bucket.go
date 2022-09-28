package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/did"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/utils"
)

type CreateBucketRequest struct {
	Creator    string              `json:"creator"`    // Creator of the bucket
	Label      string              `json:"label"`      // Label of the bucket
	Visibility string              `json:"visibility"` // Visibility of the bucket
	Role       string              `json:"role"`       // Role of the bucket
	Content    []map[string]string `json:"content"`    // Content of the bucket
}

type Content struct {
	Name      string                   `json:"name"`
	Uri       string                   `json:"uri"`
	Timestamp int64                    `json:"timestamp"`
	Type      types.ResourceIdentifier `json:"type"`
	SchemaDid string                   `json:"schemaDid"`
}

type CreateBucketResponse struct {
	Bucket  []*types.BucketItem `json:"bucket"`
	Service *did.Service        `json:"service"`
}

// @BasePath /api/v1
// @Summary CreateBucket
// @Schemes
// @Description Create a bucket on Sonr using the bucket module of Sonr's Blockchain.
// @Tags Bucket
// @Accept json
// @Produce json
// @Param 		 Creator body string true "creator" example("snr172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 Label body string true "label" example("My Bucket")
// @Param 		 Visibility body string true "visibility" example("public" or "private")
// @Param 		 Role body string true "role" example("application" or "user")
// @Param 		 Content body string true "content" example("name: My Bucket, uri: bafyreifqum26tv4wprgri5t4ddef7tozknnicuayjcvd4m5gag5avgtvsa")
// @Param 		 ResourceIdentifier body string true "ResourceIdentifier" example("did" or "cid")
// @Success 200 {object} CreateBucketResponse
// @Failure      500  {object}  FailedResponse
// @Router /bucket/create [post]
func (ns *NebulaServer) CreateBucket(c *gin.Context) {
	rBody := c.Request.Body
	var r CreateBucketRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
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

	role, err := utils.ConvertBucketRole(r.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid Conversion of Role",
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

	createBucketReq := rtmv1.CreateBucketRequest{
		Creator:    r.Creator,
		Label:      r.Label,
		Visibility: vis,
		Role:       role,
		Content:    content,
	}

	b := ns.Config.Binding

	// create the bucket
	res, err := b.Instance.CreateBucket(context.Background(), createBucketReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}
	// create the service endpoint for the bucket
	serv := res.CreateBucketServiceEndpoint()

	c.JSON(http.StatusOK, CreateBucketResponse{
		Bucket:  res.GetBucketItems(),
		Service: &serv,
	})
}
