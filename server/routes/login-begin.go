package nebula

import (
	"fmt"
	"log"
	"net/http"

	"github.com/duo-labs/webauthn/webauthn"
	"github.com/gin-gonic/gin"
)

func (ns *NebulaServer) BeginLogin(c *gin.Context) {
	req := c.Request
	writer := c.Writer
	// get username/friendly name
	vals := req.URL.Query()
	username := vals.Get("username")
	if username == "" {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": fmt.Errorf("must supply a valid username i.e. foo@bar.com", http.StatusBadRequest),
		})
		return
	}

	usr, err := ns.Store.GetUser(username)

	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": fmt.Errorf("could not find registered domain name", http.StatusBadRequest),
		})
		return
	}

	// // generate PublicKeyCredentialRequestOptions, session data
	options, sessionData, err := ns.Auth.BeginLogin(webauthn.User(usr))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("error decoding user '%s': %v", username, err),
		})
		return
	}

	// store session data as marshaled JSON
	err = ns.Store.sessionStore.SaveWebauthnSession(username+"authentication", sessionData, req, writer)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusAccepted, options)
}
