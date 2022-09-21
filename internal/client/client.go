package client

import (
	"fmt"
	"net/rpc"
)

type RpcClient struct {
	client *rpc.Client
}

func New(port int) (*RpcClient, error) {
	client, err := rpc.Dial("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return nil, err
	}

	return &RpcClient{
		client: client,
	}, nil
}
