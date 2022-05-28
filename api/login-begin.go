package handler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/duo-labs/webauthn.io/session"
	"github.com/duo-labs/webauthn/webauthn"
	//	client "github.com/sonr-io/webauthn-vercel/webauthn"
)

func BeginLogin(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	username := vals.Get("username")
	if username == "" {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}

	// get user
	user, err := userDB.GetUser(username)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	// generate PublicKeyCredentialRequestOptions, session data
	options, sessionData, err := webAuthn.BeginLogin(user)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// store session data as marshaled JSON
	err = sessionStore.SaveWebauthnSession("authentication", sessionData, r, w)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}

	JsonResponse(w, options, http.StatusOK)
}

func Setup() error {
	var err error
	webAuthn, err = webauthn.New(&webauthn.Config{
		RPDisplayName: "Sonr",                 // Display Name for your site
		RPID:          "sonr.dev",             // Generally the domain name for your site
		RPOrigin:      "https://www.sonr.dev", // The origin URL for WebAuthn requests
	})
	if err != nil {
		log.Println(err)
		return err
	}

	userDB = DB()
	sessionStore, err = session.NewStore()
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
