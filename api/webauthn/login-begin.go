package handler

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	//	"github.com/sonr-io/sonr/pkg/did"
	//	"github.com/sonr-io/highway/x/user"
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

	resp, err := http.Get(fmt.Sprintf("/query/whois-alias&username=%s", username))
	if err != nil {
		log.Printf("error getting user '%s': %v", username, err)
		http.Error(w, "error getting user", http.StatusInternalServerError)
		return
	}

	buf, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Printf("error decoding user '%s': %v", username, err)
		http.Error(w, "error decoding user", http.StatusInternalServerError)
		return
	}

	// // Unmarshal Document from JSON
	// doc := did.Document{}
	// err = doc.UnmarshalJSON(buf)
	// if err != nil {
	// 	log.Printf("error decoding user '%s': %v", username, err)
	// 	http.Error(w, "error decoding user", http.StatusInternalServerError)
	// 	return
	// }

	// // generate PublicKeyCredentialRequestOptions, session data
	// options, sessionData, err := user.WebAuthn.BeginLogin(&doc)
	// if err != nil {
	// 	log.Println(err)
	// 	JsonResponse(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// // store session data as marshaled JSON
	// err = user.SessionStore.SaveWebauthnSession("authentication", sessionData, r, w)
	// if err != nil {
	// 	log.Println(err)
	// 	JsonResponse(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	JsonResponse(w, buf, http.StatusOK)
}
