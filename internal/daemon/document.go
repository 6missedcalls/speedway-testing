package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateSchemaDocument(req rtmv1.UploadDocumentRequest, res *rtmv1.UploadDocumentResponse) (err error) {
	*res, err = d.instance.CreateSchemaDocument(req)
	return
}

func (d *Daemon) GetSchemaDocument(req rtmv1.GetDocumentRequest, res *rtmv1.GetDocumentResponse) (err error) {
	*res, err = d.instance.GetSchemaDocument(req)
	return
}
