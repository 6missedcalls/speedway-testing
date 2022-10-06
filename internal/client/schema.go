package client

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (c *RpcClient) CreateSchema(req rtmv1.CreateSchemaRequest) (*rtmv1.CreateSchemaResponse, error) {
	var response rtmv1.CreateSchemaResponse
	if err := c.client.Call("Daemon.CreateSchema", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) GetSchema(req rtmv1.QueryWhatIsRequest) (*rtmv1.QueryWhatIsResponse, error) {
	var response rtmv1.QueryWhatIsResponse
	if err := c.client.Call("Daemon.GetSchema", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}
