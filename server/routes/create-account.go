package routes

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/crypto/mpc"
	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/storage"

	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type CARequestBody struct {
	Password string `json:"password"`
}

// @BasePath /api/v1
// @Summary CreateAccount
// @Schemes
// @Description Create a new account on Sonr using the Registry module of Sonr's Blockchain.
// @Tags account
// @Produce json
// @Param 		 password body string true "Password"
// @Success 	 200  {string}  message "Did"
// @Failure      500  {string}  message "Error"
// @Router /account/create [post]
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

	aesKey, err := mpc.NewAesKey()
	if err != nil {
		fmt.Println("err", err)
	}

	req := rtmv1.CreateAccountRequest{
		Password:  body.Password,
		AesDscKey: aesKey,
	}
	fmt.Println("request", req)

	m := initmotor.InitMotor()

	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("err", err)
	}
	// send res back to client as json response
	c.JSON(200, gin.H{
		"Address": res.Address,
	})
	if storage.StoreKey(res.Address, aesKey) != nil {
		fmt.Println("err", err)
	}
}
