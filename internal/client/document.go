package client

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (c *RpcClient) CreateDocument(req rtmv1.UploadDocumentRequest) (*rtmv1.UploadDocumentResponse, error) {
	var response rtmv1.UploadDocumentResponse
	if err := c.client.Call("Daemon.CreateSchemaDocument", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}

func (c *RpcClient) GetDocument(req rtmv1.GetDocumentRequest) (*rtmv1.GetDocumentResponse, error) {
	var response rtmv1.GetDocumentResponse
	if err := c.client.Call("Daemon.GetSchemaDocument", req, &response); err != nil {
		return nil, err
	}
	return &response, nil
}
