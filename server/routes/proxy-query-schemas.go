package routes

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	WhatIs []struct {
		Did    string `json:"did"`
		Schema struct {
			Did   string `json:"did"`
			Label string `json:"label"`
			Cid   string `json:"cid"`
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

func (ns *NebulaServer) ProxyQuerySchemas(c *gin.Context) {
	resp, err := http.Get("http://v1-beta.sonr.ws:1317/sonr-io/sonr/schema/query/all_schemas?" + c.Request.URL.RawQuery)
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	var result Response
	json.Unmarshal([]byte(body), &result)

	c.JSON(http.StatusOK, result)
}
