package account

import (
	"fmt"

	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func CreateAccount(req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	m := binding.InitMotor()

	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("Create Account Error: ", err)
	}

	if storage.Store("psk.key", res.AesPsk) != nil {
		fmt.Println("Storage Error: ", err)
	}

	if storage.StoreInfo("address.snr", m) != nil {
		fmt.Println("Storage Error: ", err)
	}

	return res, err
}
