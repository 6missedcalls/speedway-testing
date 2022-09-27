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
	queryURL = "http://v1-beta.sonr.ws:1317/sonr-io/sonr/schema/query/all_schemas?"
)

var (
	ErrNotAuthorized = fmt.Errorf("you are not authorized to perform this action. please login again")
	ErrCannotParse   = fmt.Errorf("cannot parse response")
)

type SchemaResponse struct {
	WhatIs []struct {
		Did    string `json:"did"`
		Schema struct {
			Did    string `json:"did"`
			Label  string `json:"label"`
			Cid    string `json:"cid"`
			Fields []struct {
				Name     string `json:"name"`
				Field    string `json:"field"`
				LinkKind string `json:"link_kind"`
				Link     string `json:"link"`
			} `json:"fields"`
		} `json:"schema"`
		Creator   string `json:"creator"`
		Timestamp string `json:"timestamp"`
		IsActive  bool   `json:"is_active"`
		Metadata  struct {
		} `json:"metadata"`
	} `json:"what_is"`
	Pagination struct {
		NextKey interface{} `json:"next_key"`
		Total   string      `json:"total"`
	} `json:"pagination"`
}

// @BasePath /api/v1
// @Summary QuerySchemas
// @Schemes
// @Description Query the Sonr Blockchain for all public schemas on the Blockchain. This is a read-only endpoint.
// @Tags Schema
// @Produce json
// @Success 200 {object} SchemaResponse
// @Failure      500  {object} FailedResponse
// @Router /schema/query [get]
func (ns *NebulaServer) ProxyQuerySchemas(c *gin.Context) {
	resp, err := http.Get(queryURL + c.Request.URL.RawQuery)
	if err != nil {
		fmt.Println(status.Error("Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": ErrNotAuthorized})
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(status.Error("Error: "), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": ErrCannotParse})
	}

	var result SchemaResponse
	json.Unmarshal([]byte(body), &result)

	c.JSON(http.StatusOK, result)
}
