package account

import (
	"fmt"

	"github.com/sonr-io/speedway/internal/initmotor"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func CreateAccount(req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	m := initmotor.InitMotor()

	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("err", err)
	}

	if storage.StoreKey("psk.key", res.AesPsk) != nil {
		fmt.Println("err", err)
	}

	if storage.StoreInfo("address.snr", m) != nil {
		fmt.Println("err", err)
	}

	return res, err
}
