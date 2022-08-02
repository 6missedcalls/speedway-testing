package nebula

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	//	rt "github.com/sonr-io/sonr/x/registry/types"
)

func (ns *NebulaServer) FinishRegistration(c *gin.Context) {
	req := c.Request
	vals := req.URL.Query()
	username := vals.Get("username")
	os := vals.Get("os")
	label := vals.Get("label")
	if username == "" {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": fmt.Errorf("error decoding user '%s'", username),
		})
		return
	}

	// get user
	usr, err := ns.Store.GetUser(username)
	usr.Label = label
	usr.Os = os

	// user doesn't exist
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Errorf("Could not find session for user: '%s': %v", username, err),
		})
		return
	}

	// load the session data
	sessionData, err := ns.Store.sessionStore.GetWebauthnSession(username+" registration", req)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Errorf("Could not find session for user: '%s': %v", username, err),
		})
		return
	}

	credential, err := ns.Auth.FinishRegistration(usr, sessionData, req)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Errorf("Could not find session for user: '%s': %v", username, err),
		})
		return
	}

	err = usr.AddCredential(credential, os, label)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Errorf("Could not find session for user: '%s': %v", username, err),
		})
		return
	}

	// Save the new credential
	ns.Store.PutUser(usr)
	convertedCred := WebAuthnToCredential(credential)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{
			"error": fmt.Errorf("Could not find session for user: '%s': %v", username, err),
		})

		return
	}

	c.JSON(http.StatusOK, convertedCred)
}
