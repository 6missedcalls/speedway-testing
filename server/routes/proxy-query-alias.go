package routes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/status"
)

type AliasResponse struct {
	WhoIs struct {
		Alias []struct {
			Name      string `json:"name"`
			IsForSale bool   `json:"is_for_sale"`
			Amount    int    `json:"amount"`
		} `json:"alias"`
		Owner       string `json:"owner"`
		DidDocument struct {
			AlsoKnownAs []string `json:"also_known_as"`
			Context     []string `json:"context"`
			ID          string   `json:"id"`
			Service     []struct {
				ID              string `json:"id"`
				ServiceEndpoint []struct {
					Key   string `json:"key"`
					Value string `json:"value"`
				} `json:"service_endpoint"`
				Type string `json:"type"`
			} `json:"service"`
		} `json:"did_document"`
		Controllers []interface{} `json:"controllers"`
		Type        string        `json:"type"`
		Timestamp   string        `json:"timestamp"`
		IsActive    bool          `json:"is_active"`
		Metadata    struct {
		} `json:"metadata"`
	} `json:"WhoIs"`
}

func (ns *NebulaServer) ProxyQueryAlias(c *gin.Context) {
	resp, err := http.Get("http://v1-beta.sonr.ws:1317/sonr-io/sonr/registry/who_is_alias/" + c.Param("alias"))
	if err != nil {
		fmt.Println(status.Error("Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": ErrNotAuthorized})
	}

	if resp.StatusCode != 200 {
		c.JSON(resp.StatusCode, resp.Body)
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(status.Error("Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": ErrCannotParse})
	}

	var result AliasResponse
	json.Unmarshal([]byte(body), &result)

	c.JSON(http.StatusOK, result)
}
