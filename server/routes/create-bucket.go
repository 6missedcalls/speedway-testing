package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/binding"
)

type CreateBucketRequest struct {
	Creator    string                       `json:"creator"`    // Creator of the bucket
	Label      string                       `json:"label"`      // Label of the bucket
	Visibility string                       `json:"visibility"` // Visibility of the bucket
	Role       string                       `json:"role"`       // Role of the bucket
	Content    map[string]*types.BucketItem `json:"content"`    // Content of the bucket
}

// create a function that takes the r.visibility and r.role and returns the visibility and role
func swap(visibility string, role string) (types.BucketVisibility, types.BucketRole, error) {

	// convert the visibility string to an int
	var visibilityInt types.BucketVisibility
	switch visibility {
	case "public":
		visibilityInt = types.BucketVisibility_PUBLIC
	case "private":
		visibilityInt = types.BucketVisibility_PRIVATE
	}

	// convert the role string to an int
	var roleInt types.BucketRole
	switch role {
	case "application":
		roleInt = types.BucketRole_APPLICATION
	case "private":
		roleInt = types.BucketRole_USER
	}

	return visibilityInt, roleInt, nil
}

// @BasePath /api/v1
// @Summary CreateBucket
// @Schemes
// @Description Create a bucket on Sonr using the object module of Sonr's Blockchain.
// @Tags bucket
// @Produce json
// @Param 		 body body CreateBucketRequest true "CreateBucketRequest" example("{\"creator\":\"did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p\",\"label\":\"My Bucket\",\"visibility\":\"public\",\"role\":\"application\",\"content\":{\"key\":\"value\"}}")
// @Success 200 {object} bucket.Bucket
// @Failure      500  {string}  message
// @Router /bucket/create [post]
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

	// Take r.Content and convert it to []*types.BucketItem
	var items []*types.BucketItem
	for k, v := range r.Content {
		v.Name = k
		items = append(items, v)
	}
	fmt.Println(items)

	vis, role, err := swap(r.Visibility, r.Role)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Parse Error - Invalid Visibility or Role",
		})
		return
	}
	fmt.Printf("visibility: %v, role: %v", vis, role)

	// Create a new create bucket request
	createBucketReq := rtmv1.CreateBucketRequest{
		Creator:    r.Creator,
		Label:      r.Label,
		Visibility: vis,
		Role:       role,
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
