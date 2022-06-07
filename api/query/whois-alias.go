package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/sonr-io/sonr/pkg/did"
	rt "github.com/sonr-io/sonr/x/registry/types"
)

// from: https://github.com/duo-labs/webauthn.io/blob/3f03b482d21476f6b9fb82b2bf1458ff61a61d41/server/response.go#L15
func JsonResponse(w http.ResponseWriter, d interface{}, c int) {
	dj, err := json.Marshal(d)
	if err != nil {
		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(c)
	fmt.Fprintf(w, "%s", dj)
}

func QueryWhoIsAlias(w http.ResponseWriter, r *http.Request) {
	// Get Base API path
	base := os.Getenv("BLOCKCHAIN_API_URL")
	// get username/friendly name
	vals := r.URL.Query()
	username := vals.Get("username")
	if username == "" {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}

	resp, err := http.Get(fmt.Sprintf("%s/sonr-io/sonr/registry/who_is_alias/%s", base, username))
	if err != nil {
		log.Printf("error getting user '%s': %v", username, err)
		JsonResponse(w, "error getting user", http.StatusInternalServerError)
		return
	}

	target := rt.QueryWhoIsAliasResponse{}
	err = json.NewDecoder(resp.Body).Decode(&target)
	if err != nil {
		log.Printf("error decoding user '%s': %v", username, err)
		JsonResponse(w, "error decoding user", http.StatusInternalServerError)
		return
	}

	// Unmarshal Document from JSON
	doc := did.Document{}
	buf := target.GetWhoIs().GetDidDocument()
	err = doc.UnmarshalJSON(buf)
	if err != nil {
		log.Printf("error decoding user '%s': %v", username, err)
		JsonResponse(w, "error decoding user", http.StatusInternalServerError)
		return
	}
	JsonResponse(w, doc, http.StatusOK)
}
