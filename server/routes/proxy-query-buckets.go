package routes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/status"
)

const (
	bucketQueryUrl = "http://v1-beta.sonr.ws:1317/sonr-io/sonr/bucket/where_is?"
)

// @BasePath /api/v1
// @Summary QueryBuckets
// @Schemes
// @Description Query the Sonr Blockchain for all public buckets on the Blockchain. This is a read-only endpoint.
// @Tags Bucket
// @Produce json
// @Success 200 {object} BucketResponse
// @Failure      500  {object} FailedResponse
// @Router /bucket/query [get]
type BucketResponse struct {
	WhereIs []struct {
		Did        string        `json:"did"`
		Creator    string        `json:"creator"`
		Label      string        `json:"label"`
		Visibility string        `json:"visibility"`
		Role       string        `json:"role"`
		IsActive   bool          `json:"is_active"`
		Content    []interface{} `json:"content"`
		ContentAcl []interface{} `json:"content_acl"`
		Timestamp  string        `json:"timestamp"`
	} `json:"where_is"`
}

func (ns *NebulaServer) ProxyQueryBuckets(c *gin.Context) {
	resp, err := http.Get(bucketQueryUrl + c.Request.URL.RawQuery)
	if err != nil {
		fmt.Println(status.Error("Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": ErrNotAuthorized})
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(status.Error("Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": ErrCannotParse})
	}

	var result BucketResponse
	json.Unmarshal([]byte(body), &result)

	c.JSON(http.StatusOK, result)
}
