package routes

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/retrieve"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type GetObject struct {
	Address   string `json:"address"`
	SchemaDid string `json:"schemaDid"`
	ObjectCid string `json:"objectCid"`
}

// @BasePath /api/v1
// @Summary GetObject
// @Schemes
// @Description Get an object on Sonr using the object module of Sonr's Blockchain.
// @Tags object
// @Produce json
// @Param 		 Address body string true "Address" example("snr172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 SchemaDid body string true "SchemaDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 ObjectCid body string true "ObjectCid" example("bafyreigfzxrtvfzuaoyhn5vgndneeeirq62efgf2s3igmoenxgx7jxy2cm")
// @Success 200 {object} object.ObjectReference
// @Failure      500  {string}  message
// @Router /object/get [post]
func (ns *NebulaServer) GetObject(c *gin.Context) {
	rBody := c.Request.Body
	var body GetObject
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	// init motor
	m := initmotor.InitMotor()

	// Get Keys
	aesKey, pskKey, err := storage.AutoLoadKey()
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Error loading keys",
		})
		return
	}

	// Build request
	loginRequest := rtmv1.LoginRequest{
		Did:       body.Address,
		AesDscKey: aesKey,
		AesPskKey: pskKey,
	}
	if err != nil {
		fmt.Println("err", err)
	}

	// Login
	resp, err := account.Login(m, loginRequest)
	if err != nil {
		fmt.Println("err", err)
	}
	fmt.Println("response", resp)

	object, err := retrieve.GetObject(m, body.SchemaDid, body.ObjectCid)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return
	}
	c.JSON(200, object)
}
