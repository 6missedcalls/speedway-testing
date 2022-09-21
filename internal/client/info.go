package client

import (
	"github.com/sonr-io/speedway/internal/daemon"
)

func (c *RpcClient) GetSessionInfo() (*daemon.GetSessionInfoResponse, error) {
	var (
		request  daemon.GetSessionInfoRequest
		response daemon.GetSessionInfoResponse
	)
	if err := c.client.Call("Daemon.GetSessionInfo", request, &response); err != nil {
		return nil, err
	}
	return &response, nil
}
