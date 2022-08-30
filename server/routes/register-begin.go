package routes

import (
	"fmt"
	"log"
	"net/http"

	"github.com/duo-labs/webauthn/protocol"
	"github.com/gin-gonic/gin"
)

func (ns *NebulaServer) BeginRegistration(c *gin.Context) {
	req := c.Request
	writer := c.Writer
	// get username/friendly name
	vals := req.URL.Query()
	username := vals.Get("username")
	if username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Errorf("must supply a valid username i.e. foo@bar.com"),
		})
		return
	}

	// get user
	doc, err := ns.Store.InitUser(username)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("must supply a valid username i.e. foo@bar.com"),
		})
	}

	registerOptions := func(credCreationOpts *protocol.PublicKeyCredentialCreationOptions) {
		credCreationOpts.CredentialExcludeList = []protocol.CredentialDescriptor{}
		credCreationOpts.AuthenticatorSelection.UserVerification = protocol.VerificationDiscouraged
		credCreationOpts.AuthenticatorSelection.RequireResidentKey = &[]bool{false}[0]
		credCreationOpts.AuthenticatorSelection.AuthenticatorAttachment = protocol.Platform
	}

	// generate PublicKeyCredentialCreationOptions, session data
	options, sessionData, err := ns.Auth.BeginRegistration(
		doc,
		registerOptions,
	)
	log.Println(sessionData.Challenge)
	options.Response.User.DisplayName = username
	options.Response.User.Name = username
	options.Response.User.Icon = "" // REMOVE THE DEFAULT ICON

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("error while storing sessino state"),
		})
		return
	}

	// store session data as marshaled JSON
	err = ns.Store.sessionStore.SaveWebauthnSession(username+" registration", sessionData, req, writer)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("error while storing sessino state"),
		})
		return
	}

	c.JSON(http.StatusOK, options)
}
