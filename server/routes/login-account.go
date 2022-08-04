package nebula

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/gin-gonic/gin"
	mtr "github.com/sonr-io/sonr/pkg/motor" // TODO: Wait for PR to be merged
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type LoginRequestBody struct {
	Did      string `json:"did"`
	Password string `json:"password"`
}

func loadKey(path string) ([]byte, error) {
	var file *os.File
	if _, err := os.Stat(path); err != nil {
		if os.IsNotExist(err) {
			return nil, err
		}
		return nil, err
	}
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	return data, nil
}

func (ns *NebulaServer) LoginAccount(c *gin.Context) {
	rBody := c.Request.Body
	var body LoginRequestBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	aesPskKey, err := loadKey("./PSK.key")
	if err != nil {
		fmt.Println("err", err)
	}
	req := (rtmv1.LoginRequest{
		Did:       body.Did,
		Password:  body.Password,
		AesPskKey: aesPskKey,
	})
	if err != nil {
		fmt.Println("err", err)
	}
	fmt.Println("request", req)
	m := mtr.EmptyMotor("Test_Device")
	res, err := m.Login(req)
	if err != nil {
		fmt.Println("err", err)
	}
	fmt.Println("Result", res)
	if res.Success {
		c.JSON(200, gin.H{
			"Address":     m.Address,
			"DIDDocument": m.DIDDocument,
		})
	} else {
		c.JSON(500, gin.H{
			"error": "Account login failed",
		})
	}
}
