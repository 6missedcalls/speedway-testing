package handler

import (
	"fmt"
	"io/ioutil"
	"net/http"

	rt "github.com/sonr-io/sonr/x/registry/types"
)

func DeactivateWhoIs(w http.ResponseWriter, r *http.Request) {
	// get username/friendly name
	vals := r.URL.Query()
	username := vals.Get("username")
	if username == "" {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}

	buf, err := ioutil.ReadAll(r.Body)
	if err != nil {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}

	var reqMsg *rt.MsgDeactivateWhoIs
	if err := reqMsg.Unmarshal(buf); err != nil {
		JsonResponse(w, fmt.Errorf("must supply a valid username i.e. foo@bar.com"), http.StatusBadRequest)
		return
	}
}
