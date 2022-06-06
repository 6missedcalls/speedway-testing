package handler

import (
	"fmt"
	"net/http"
)

func QueryAlias(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	endpoint, err := createQueryUrl(vals)
	if err != nil {
		JsonResponse(w, err, http.StatusBadRequest)
	}
	fmt.Println(endpoint)
}
