package nebula

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/crypto"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type CARequestBody struct {
	Password string `json:"password"`
}

func storeKey(name string, key []byte) error {
	// TODO: use a better way to store keys
	file, err := os.Create(name)
	if err != nil {
		return err
	}
	defer file.Close()
	_, err = file.Write(key)
	if err != nil {
		return err
	}
	return nil
}

func (ns *NebulaServer) CreateAccount(c *gin.Context) {
	rBody := c.Request.Body
	var body CARequestBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	// TODO: Add better validation
	aesKey, err := crypto.NewAesKey()
	if err != nil {
		fmt.Println("err", err)
	}
	fmt.Println("aesKey", aesKey)
	req := (rtmv1.CreateAccountRequest{
		Password:  body.Password,
		AesDscKey: aesKey,
	})
	fmt.Println("request", req)
	if err != nil {
		fmt.Println("reqBytes err", err)
	}

	m := mtr.EmptyMotor("Test_Device")
	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("err", err)
	}
	c.JSON(200, gin.H{
		"Did": res.Address,
	})
	if storeKey("PSK.key", res.AesPsk) != nil {
		fmt.Println("err", err)
	}
}
