package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/crypto/mpc"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/storage"

	rtmv1 "github.com/sonr-io/sonr/pkg/motor/types"
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
// @Success 	 200  {string}  message "Address"
// @Failure      500  {string}  message "Error"
// @Router /account/create [post]
func (ns *NebulaServer) CreateAccount(c *gin.Context) {
	rBody := c.Request.Body
	var body CARequestBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Request Body",
		})
		return
	}

	aesKey, err := mpc.NewAesKey()
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could not generate AES key",
		})
		return
	}
	if storage.Store("aes.key", aesKey) != nil {
		fmt.Println("Storage Error: ", err)
		return
	}

	req := rtmv1.CreateAccountRequest{
		Password:  body.Password,
		AesDscKey: aesKey,
	}
	instance := binding.CreateInstance()

	res, err := instance.CreateAccount(req)
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Could Not Create Account",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Address": res.Address,
	})
}
