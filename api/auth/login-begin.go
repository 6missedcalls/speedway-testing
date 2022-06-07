package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/duo-labs/webauthn.io/session"
	"github.com/duo-labs/webauthn/webauthn"

	"github.com/sonr-io/sonr/pkg/did"
	rt "github.com/sonr-io/sonr/x/registry/types"
	//	client "github.com/sonr-io/webauthn-vercel/webauthn"
)

func BeginLogin(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	username := vals.Get("username")
	base := os.Getenv("BLOCKCHAIN_API_URL")
	if username == "" {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}

	resp, err := http.Get(fmt.Sprintf("%s/sonr-io/sonr/registry/who_is_alias/%s", base, username))
	if err != nil {
		log.Printf("error getting user '%s': %v", username, err)
		http.Error(w, "error getting user", http.StatusInternalServerError)
		return
	}

	target := rt.QueryWhoIsAliasResponse{}
	err = json.NewDecoder(resp.Body).Decode(&target)
	if err != nil {
		log.Printf("error decoding user '%s': %v", username, err)
		http.Error(w, "error decoding user", http.StatusInternalServerError)
		return
	}

	// Unmarshal Document from JSON
	doc := did.Document{}
	buf := target.GetWhoIs().GetDidDocument()
	err = doc.UnmarshalJSON(buf)
	if err != nil {
		log.Printf("error decoding user '%s': %v", username, err)
		http.Error(w, "error decoding user", http.StatusInternalServerError)
		return
	}

	// generate PublicKeyCredentialRequestOptions, session data
	options, sessionData, err := webAuthn.BeginLogin(&doc)
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
		RPDisplayName: "Sonr - Highway",         // Display Name for your site
		RPID:          "highway.sh",             // Generally the domain name for your site
		RPOrigin:      "https://www.highway.sh", // The origin URL for WebAuthn requests
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
