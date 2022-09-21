package client

import (
	"context"
	"errors"
	"fmt"
	"net/rpc"
)

type RpcClient struct {
	client *rpc.Client
}

func New(ctx context.Context) (*RpcClient, error) {
	port, ok := ctx.Value("DAEMON_PORT").(int)
	if !ok {
		return nil, errors.New("port not found")
	}

	return WithPort(port)
}

func WithPort(port int) (*RpcClient, error) {
	client, err := rpc.Dial("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return nil, err
	}

	return &RpcClient{
		client: client,
	}, nil
}
