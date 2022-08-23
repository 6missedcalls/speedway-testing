package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	rtmv1 "github.com/sonr-io/sonr/pkg/motor/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/storage"
)

type LoginRequestBody struct {
	Address  string `json:"address"`
	Password string `json:"password"`
}

// @BasePath /api/v1
// @Summary LoginAccount
// @Schemes
// @Description Login to an existing account on Sonr using the Registry module of Sonr's Blockchain.
// @Tags account
// @Produce json
// @Param 		 Did body string true "Did" example("snr172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 Password body string true "Password" example("Password")
// @Success 200 {object} rtmv1.LoginResponse
// @Failure      500  {string}  message
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
	aesPskKey, err := storage.Load("psk.key")
	if err != nil {
		fmt.Println("err", err)
	}
	req := rtmv1.LoginRequest{
		Did:       body.Address,
		Password:  body.Password,
		AesPskKey: aesPskKey,
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
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Login failed",
		})
	} else {
		addr, err := m.GetAddress()
		if err != nil {
			fmt.Println("GetAddress Error: ", err)
		}
		didDocument, err := m.GetDidDocument()
		if err != nil {
			fmt.Println("GetDidDocument Error: ", err)
		}
		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"Address":     addr,
			"DIDDocument": didDocument,
		})
	}

}
