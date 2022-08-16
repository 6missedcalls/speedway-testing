package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/speedway/internal/account"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
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
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	aesPskKey, err := storage.LoadKey("psk.key")
	if err != nil {
		fmt.Println("err", err)
	}
	req := (rtmv1.LoginRequest{
		Did:       body.Address,
		Password:  body.Password,
		AesPskKey: aesPskKey,
	})
	if err != nil {
		fmt.Println("err", err)
	}

	m := account.InitMotor()
	res, err := account.Login(m, req)
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Login Error",
		})
		return
	}
	fmt.Println("Result", res)
	if !res.Success {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Login failed",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"Address":     m.GetAddress(),
			"DIDDocument": m.GetDIDDocument(),
		})
	}

}
