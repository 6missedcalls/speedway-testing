package handler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/duo-labs/webauthn/protocol"
	"github.com/sonr-io/highway/x/user"
)

func BeginRegistration(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	username := vals.Get("username")
	if username == "" {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}

	// get user
	doc, err := user.InitUser(username)
	if err != nil {
		JsonResponse(w, err, http.StatusInternalServerError)
		return
	}
	registerOptions := func(credCreationOpts *protocol.PublicKeyCredentialCreationOptions) {
		credCreationOpts.CredentialExcludeList = []protocol.CredentialDescriptor{}
	}

	// generate PublicKeyCredentialCreationOptions, session data
	options, sessionData, err := user.WebAuthn.BeginRegistration(
		doc,
		registerOptions,
	)

	options.Response.User.DisplayName = username

	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// store session data as marshaled JSON
	err = user.SessionStore.SaveWebauthnSession("registration", sessionData, r, w)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	JsonResponse(w, options, http.StatusOK)
}
