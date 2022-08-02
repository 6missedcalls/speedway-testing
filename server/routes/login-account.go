package nebula

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	// mtr "github.com/sonr-io/sonr/pkg/motor" // TODO: Wait for PR to be merged
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type LoginRequestBody struct {
	Did       string `json:"did"`
	Password  string `json:"password"`
	AesPskKey []byte `json:"aesPskKey"`
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
	// TODO: If Login is Successful return 200 with a token
	// TODO: If Login is Unsuccessful return 401 with a message
	req, err := json.Marshal(rtmv1.LoginRequest{
		Did:       body.Did,
		Password:  body.Password,
		AesPskKey: body.AesPskKey,
	})
	if err != nil {
		fmt.Println("err", err)
	}
	fmt.Println("request", req)
	// m := mtr.EmptyMotor("Test_Device")
	// res, err := m.Login(req)
	// if err != nil {
	// 	fmt.Println("err", err)
	// }
	// fmt.Println("Result", res)
	// fmt.Println("DIDDocument", m.DIDDocument)
	// fmt.Println("Address", m.Address)
	// fmt.Println("Balance", m.Balance())

	c.JSON(200, gin.H{
		"message": "Account logged in",
	})
}
