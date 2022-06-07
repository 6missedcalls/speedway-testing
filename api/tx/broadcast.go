package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

func BroadcastTx(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	body := r.Body
	base := os.Getenv("BLOCKCHAIN_API_URL")

	resp, err := http.Post(fmt.Sprintf("%s/cosmos/tx/v1", base), "application/json", body)
	if err != nil {
		log.Printf("error broadcasting tx: %v", err)
		JsonResponse(w, "error broadcasting tx", http.StatusInternalServerError)
		return
	}
	JsonResponse(w, resp.Body, http.StatusOK)
}