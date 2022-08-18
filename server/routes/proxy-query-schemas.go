package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func (ns *NebulaServer) ProxyQuerySchemas(c *gin.Context) {
	c.Redirect(http.StatusMovedPermanently, "http://v1-beta.sonr.ws:1317/sonr-io/sonr/schema/query/all_schemas?"+c.Request.URL.RawQuery)
}
