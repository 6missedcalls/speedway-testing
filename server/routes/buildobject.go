package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type BuildObjectBody struct {
	Address   string                 `json:"address"`
	SchemaDid string                 `json:"schemaDid"`
	Label     string                 `json:"label"`
	Object    map[string]interface{} `json:"object"`
}

// @BasePath /api/v1
// @Summary BuildObject
// @Schemes
// @Description Build an object on Sonr using the object module of Sonr's Blockchain.
// @Tags object
// @Produce json
// @Param 		 Address body string true "Address" example("snr172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 SchemaDid body string true "SchemaDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 Label body string true "Label" example("MyObject")
// @Param 		 Object body map[string]interface{} true "Object" example({"name": "John Doe"})
// @Success 200 {object} object.ObjectReference
// @Failure      500  {string}  message
// @Router /object/build [post]
func (ns *NebulaServer) BuildObject(c *gin.Context) {
	rBody := c.Request.Body
	var body BuildObjectBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	label := body.Label
	// init motor
	m := account.InitMotor()

	aesKey, aesPskKey, err := storage.AutoLoadKey()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Error loading keys",
		})
		return
	}

	// Build request
	req := rtmv1.LoginRequest{
		Did:       body.Address,
		AesDscKey: aesKey,
		AesPskKey: aesPskKey,
	}
	if err != nil {
		fmt.Println("err", err)
	}

	// Login to Sonr
	res, err := account.Login(m, req)
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Login Error",
		})
		return
	}
	fmt.Println("Result", res)
	if !res.Success {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": res,
		})
	}

	// query whatis
	querySchema, err := m.QueryWhatIs(context.Background(), rtmv1.QueryWhatIsRequest{
		Creator: m.GetDID().String(),
		Did:     body.SchemaDid,
	})
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return
	}
	fmt.Printf("%v\n", querySchema.WhatIs)

	// Initialize NewObjectBuilder
	objBuilder, err := m.NewObjectBuilder(body.SchemaDid)
	if err != nil {
		fmt.Println("err", err)
	}

	objBuilder.SetLabel(label)

	// Iterate through object and add to builder
	for k, v := range body.Object {
		objBuilder.Set(k, v)
	}

	// Upload the object
	upload, err := objBuilder.Upload()
	if err != nil {
		fmt.Println("err", err)
		// create 500 error response
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	c.JSON(http.StatusOK, gin.H{
		"reference": upload.Reference,
	})
}
