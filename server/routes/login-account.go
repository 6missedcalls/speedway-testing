package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/storage"
)

type LoginRequestBody struct {
	Address  string `json:"address"`
	Password string `json:"password"`
}

type FailedLogin struct {
	Success bool `json:"success"`
}

type SuccessfulLogin struct {
	Success bool   `json:"success"`
	Address string `json:"address"`
}

// @BasePath /api/v1
// @Summary LoginAccount
// @Schemes
// @Description Login to an existing account on Sonr using the Registry module of Sonr's Blockchain.
// @Tags Account
// @Accept json
// @Produce json
// @Param Did body string true "did" example("snr172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param Password body string true "password" example("Password")
// @Success 200 {object} SuccessfulLogin
// @Failure 500  {object}  FailedLogin
// @Router /account/login [post]
func (ns *NebulaServer) LoginAccount(c *gin.Context) {
	rBody := c.Request.Body
	var body LoginRequestBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	aesPskKey, err := storage.Load("psk")
	if err != nil {
		fmt.Println("err", err)
	}

	req := rtmv1.LoginRequest{
		Did:       body.Address,
		Password:  body.Password,
		AesPskKey: aesPskKey.Data,
	}

	m := binding.CreateInstance()

	// Login to account with Speedway binding
	res, err := m.Login(req)
	if err != nil {
		fmt.Println("Login Error: ", err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Login Error",
		})
		return
	}
	fmt.Println("Result", res)
	if !res.Success {
		c.JSON(http.StatusUnauthorized, FailedLogin{
			Success: false,
		})
	} else {
		addr, err := m.GetAddress()
		if err != nil {
			fmt.Println("GetAddress Error: ", err)
		}
		// use SuccessfulLogin struct to return address
		c.JSON(http.StatusOK, SuccessfulLogin{
			Success: true,
			Address: addr,
		})
	}
}
