package nebula

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/crypto"

	// mtr "github.com/sonr-io/sonr/internal/motor" // TODO: Wait for PR to be merged
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type CARequestBody struct {
	Password string `json:"password"`
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
	req, err := json.Marshal(rtmv1.CreateAccountRequest{
		Password:  body.Password,
		AesDscKey: aesKey,
	})
	fmt.Println("request", req)
	if err != nil {
		fmt.Println("reqBytes err", err)
	}
	// TODO: If CreateAccount is Successful return 200
	// TODO: If CreateAccount is Unsuccessful return 401 with a message
	// m := mtr.EmptyMotor("Test_Device")
	// res, err := m.CreateAccount(req)
	// if err != nil {
	// 	fmt.Println("err", err)
	// }
	// fmt.Println(res)
	c.JSON(200, gin.H{
		"message": "Account created",
	})

}
