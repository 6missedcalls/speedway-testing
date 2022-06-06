package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
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

func QueryWhoIs(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	endpoint, err := createQueryUrl(vals)
	if err != nil {
		JsonResponse(w, err, http.StatusBadRequest)
	}
	fmt.Println(endpoint)
}

// createQueryUrl is a helper method that parses the url request string for the proper query parameter for the
// registry module. If succesful a string API endpoint to utilize in a GET request is provided
func createQueryUrl(vals url.Values) (string, error) {
	if vals.Has("controller") {
		return fmt.Sprintf("/v1/registry/query/whois/controller/%s", vals.Get("controller")), nil
	}

	if vals.Has("alias") {
		return fmt.Sprintf("/v1/registry/query/whois/alias/%s", vals.Get("alias")), nil
	}

	if vals.Has("did") {
		return fmt.Sprintf("/v1/registry/query/whois/%s", vals.Get("did")), nil
	}
	return "", errors.New("No Query parameter (controller, did, or alias) provided in request")
}
