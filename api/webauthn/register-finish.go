package handler

import (
	"fmt"
	"log"
	"net/http"

	"github.com/sonr-io/highway/x/user"
	//	rt "github.com/sonr-io/sonr/x/registry/types"
)

func FinishRegistration(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	username := vals.Get("username")
	os := vals.Get("os")
	label := vals.Get("label")
	if username == "" {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}
	// get user
	usr, err := user.DB.GetUser(username)
	// user doesn't exist
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	// load the session data
	sessionData, err := user.SessionStore.GetWebauthnSession("registration", r)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	credential, err := user.WebAuthn.FinishRegistration(usr, sessionData, r)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = usr.AddCredential(credential, os, label)
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Save the new credential
	// user.AddAuthenticationMethod(vm)
	user.DB.PutUser(usr)
	jsonResp, err := usr.Document.MarshalJSON()
	if err != nil {
		log.Println(err)
		JsonResponse(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JsonResponse(w, jsonResp, http.StatusOK)
}
