package account

import (
	"fmt"

	"github.com/sonr-io/speedway/internal/initmotor"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func Login(req rtmv1.LoginRequest) (rtmv1.LoginResponse, error) {
	m := initmotor.InitMotor()

	res, err := m.Login(req)
	if err != nil {
		fmt.Println("err", err)
	}

	return res, err
}
