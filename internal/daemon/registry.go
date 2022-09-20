package daemon

import (
	"context"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	rt "github.com/sonr-io/sonr/x/registry/types"
)

func (d *Daemon) CreateAccount(req rtmv1.CreateAccountRequest, res *rtmv1.CreateAccountResponse) (err error) {
	*res, err = d.instance.CreateAccount(req)
	return
}

func (d *Daemon) CreateAccountWithKeys(req rtmv1.CreateAccountWithKeysRequest, res *rtmv1.CreateAccountWithKeysResponse) (err error) {
	*res, err = d.instance.CreateAccountWithKeys(req)
	return
}

func (d *Daemon) Login(req rtmv1.LoginRequest, res *rtmv1.LoginResponse) (err error) {
	*res, err = d.instance.Login(req)
	return
}

func (d *Daemon) LoginWithKeys(req rtmv1.LoginWithKeysRequest, res *rtmv1.LoginResponse) (err error) {
	*res, err = d.instance.LoginWithKeys(req)
	return
}

func (d *Daemon) BuyAlias(req rt.MsgBuyAlias, res *rt.MsgBuyAliasResponse) (err error) {
	*res, err = d.instance.BuyAlias(context.Background(), req)
	return
}

func (d *Daemon) SellAlias(req rt.MsgSellAlias, res *rt.MsgSellAliasResponse) (err error) {
	*res, err = d.instance.SellAlias(context.Background(), req)
	return
}

func (d *Daemon) TransferAlias(req rt.MsgTransferAlias, res *rt.MsgTransferAliasResponse) (err error) {
	*res, err = d.instance.TransferAlias(context.Background(), req)
	return
}
