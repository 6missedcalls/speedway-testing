package client

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	rt "github.com/sonr-io/sonr/x/registry/types"
)

func (c *RpcClient) CreateAccount(req rtmv1.CreateAccountRequest) (*rtmv1.CreateAccountResponse, error) {
	var response rtmv1.CreateAccountResponse
	if err := c.client.Call("Daemon.CreateAccount", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) CreateAccountWithKeys(req rtmv1.CreateAccountWithKeysRequest) (*rtmv1.CreateAccountWithKeysResponse, error) {
	var response rtmv1.CreateAccountWithKeysResponse
	if err := c.client.Call("Daemon.CreateAccountWithKeys", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) Login(req rtmv1.LoginRequest) (*rtmv1.LoginResponse, error) {
	var response rtmv1.LoginResponse
	if err := c.client.Call("Daemon.Login", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) LoginWithKeys(req rtmv1.LoginWithKeysRequest) (*rtmv1.LoginResponse, error) {
	var response rtmv1.LoginResponse
	if err := c.client.Call("Daemon.LoginWithKeys", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) BuyAlias(req rt.MsgBuyAlias) (*rt.MsgBuyAliasResponse, error) {
	var response rt.MsgBuyAliasResponse
	if err := c.client.Call("Daemon.BuyAlias", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) SellAlias(req rt.MsgSellAlias) (*rt.MsgSellAliasResponse, error) {
	var response rt.MsgSellAliasResponse
	if err := c.client.Call("Daemon.SellAlias", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) TransferAlias(req rt.MsgTransferAlias) (*rt.MsgTransferAliasResponse, error) {
	var response rt.MsgTransferAliasResponse
	if err := c.client.Call("Daemon.TransferAlias", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}
