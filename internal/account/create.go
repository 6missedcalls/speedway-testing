package account

import (
	"fmt"

	"github.com/sonr-io/sonr/pkg/motor"
	"github.com/sonr-io/speedway/internal/storage"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func CreateAccount(m motor.MotorNode, req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	res, err := m.CreateAccount(req)
	if err != nil {
		fmt.Println("Create Account Error: ", err)
		return res, err
	}

	if storage.Store("psk.key", res.AesPsk) != nil {
		fmt.Println("Storage Error: ", err)
		return res, err
	}

	if storage.StoreInfo("address.snr", m) != nil {
		fmt.Println("Storage Error: ", err)
		return res, err
	}

	return res, err
}
