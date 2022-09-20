package daemon

import (
	"fmt"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateAccount(req rtmv1.CreateAccountRequest, res *rtmv1.CreateAccountResponse) error {
	*res = rtmv1.CreateAccountResponse{}
	return fmt.Errorf("TODO: not implemented")
}

func (d *Daemon) CreateAccountWithKeys(req rtmv1.CreateAccountWithKeysRequest, res *rtmv1.CreateAccountWithKeysResponse) error {
	*res = rtmv1.CreateAccountWithKeysResponse{}
	return fmt.Errorf("TODO: not implemented")
}

func (d *Daemon) Login(req rtmv1.LoginRequest, res *rtmv1.LoginResponse) error {
	*res = rtmv1.LoginResponse{}
	return fmt.Errorf("TODO: not implemented")
}

func (d *Daemon) LoginWithKeys(req rtmv1.LoginWithKeysRequest, res *rtmv1.LoginResponse) error {
	*res = rtmv1.LoginResponse{}
	return fmt.Errorf("TODO: not implemented")
}
