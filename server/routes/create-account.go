package nebula

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/crypto"
	"github.com/sonr-io/speedway/pkg/hwid"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type CARequestBody struct {
	Password string `json:"password"`
}

func storeKey(name string, key []byte) error {
	homedir, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	if _, err := os.Stat(homedir + "/.speedway/keys/" + name); os.IsNotExist(err) {
		err := os.MkdirAll(homedir+"/.speedway/keys/", 0700)
		if err != nil {
			return err
		}
	}
	store, err := os.Create(homedir + "/.speedway/keys/" + name)
	if err != nil {
		return err
	}
	_, err = store.Write(key)
	defer store.Close()
	return err
}

// @BasePath /api/v1
// @Summary CreateAccount
// @Schemes
// @Description Create a new account on Sonr using the Registry module of Sonr's Blockchain.
// @Tags account
// @Produce json
// @Param 		 password body string true "Password"
// @Success 	 200  {string}  message "Did"
// @Failure      500  {string}  message
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
	// get hwid
	hwid, err := hwid.GetHwid()
	if err != nil {
		fmt.Println("err", err)
	}
	m := mtr.EmptyMotor(hwid)
	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("err", err)
	}
	// send res back to client as json response
	c.JSON(200, gin.H{
		"Address": res.Address,
	})
	if storeKey(res.Address, aesKey) != nil {
		fmt.Println("err", err)
	}
}
