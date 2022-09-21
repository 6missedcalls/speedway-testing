package client

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (c *RpcClient) CreateBucket(req rtmv1.CreateBucketRequest) (*rtmv1.CreateBucketResponse, error) {
	var response rtmv1.CreateBucketResponse
	if err := c.client.Call("Daemon.CreateBucket", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) GetBucketsByCreator(req rtmv1.QueryWhereIsByCreatorRequest) (*rtmv1.QueryWhereIsByCreatorResponse, error) {
	var response rtmv1.QueryWhereIsByCreatorResponse
	if err := c.client.Call("Daemon.GetBucketsByCreator", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) GetBucketById(req rtmv1.QueryWhereIsRequest) (*rtmv1.QueryWhereIsResponse, error) {
	var response rtmv1.QueryWhereIsResponse
	if err := c.client.Call("Daemon.GetBucketById", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}
