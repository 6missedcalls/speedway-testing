package routes

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/initmotor"
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
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	label := body.Label
	// init motor
	m := initmotor.InitMotor()

	// Load keys
	aesKey, err := storage.LoadKey("aes.key")
	// return err from loadkey
	if err != nil {
		fmt.Println(err)
		return
	}
	aesPskKey, err := storage.LoadKey("psk.key")
	if err != nil {
		fmt.Println("err", err)
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
	fmt.Println("request", req)

	// Login to Sonr
	res, err := m.Login(req)
	if err != nil {
		fmt.Println("err", err)
		return
	}
	fmt.Println("Result", res)
	if !res.Success {
		c.JSON(500, gin.H{
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
		c.JSON(500, gin.H{
			"error": err,
		})
	}
	c.JSON(200, gin.H{
		"reference": upload.Reference,
	})
}
