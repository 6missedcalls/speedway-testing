package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/pkg/motor/types"
	"github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type CreateBucketRequest struct {
	Creator    string                 `json:"creator"`    // Creator of the bucket
	Label      string                 `json:"label"`      // Label of the bucket
	Visibility types.BucketVisibility `json:"visibility"` // Visibility of the bucket
	Role       types.BucketRole       `json:"role"`       // Role of the bucket
	// Content    map[string]*types.BucketItem `json:"content"`    // Content of the bucket
}

func (ns *NebulaServer) CreateBucket(c *gin.Context) {
	rBody := c.Request.Body
	var r CreateBucketRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	// Create a new create bucket request
	createBucketReq := rtmv1.CreateBucketRequest{
		Creator:    r.Creator,
		Label:      r.Label,
		Visibility: 1,
		Role:       2,
		Content:    make([]*types.BucketItem, 0),
	}

	b := binding.CreateInstance()

	// create the bucket
	res, err := b.CreateBucket(context.Background(), createBucketReq)
	if err != nil {
		fmt.Println("Create Bucket Error: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could Not Create Bucket",
		})
		return
	}

	c.JSON(http.StatusOK, res)
}
