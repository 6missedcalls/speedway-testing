package routes

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (ns *NebulaServer) FinishLogin(c *gin.Context) {
	req := c.Request
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
	usr, err := ns.Store.GetUser(username)

	// user doesn't exist
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Errorf("error while looking up session context"),
		})
		return
	}

	// load the session data
	sessionData, err := ns.Store.sessionStore.GetWebauthnSession(username+"authentication", req)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": fmt.Errorf("error while looking up session context"),
		})
		return
	}

	cred, err := ns.Auth.FinishLogin(usr, sessionData, req)

	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("error while resolving user login"),
		})
		return
	}

	if cred.Authenticator.CloneWarning {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Errorf("error resolving device"),
		})
	}

	cred.Authenticator.SignCount += 1
	// handle successful login
	c.JSON(http.StatusOK, cred)
}
