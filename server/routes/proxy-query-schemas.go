package routes

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (ns *NebulaServer) ProxyQuerySchemas(c *gin.Context) {
	res, err := http.Get("http://v1-beta.sonr.ws:1317/sonr-io/sonr/schema/query/all_schemas?" + c.Request.URL.RawQuery)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responseBody := res.Body
	var responseBodyMap map[string]interface{}

	err = json.NewDecoder(responseBody).Decode(&responseBodyMap)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, responseBodyMap)
}
