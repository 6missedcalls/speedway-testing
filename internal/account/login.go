package account

import (
	"fmt"

	"github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func Login(m motor.MotorNode, req rtmv1.LoginRequest) (rtmv1.LoginResponse, error) {
	res, err := m.Login(req)
	if err != nil {
		fmt.Println("err", err)
		return res, err
	}

	return res, err
}
