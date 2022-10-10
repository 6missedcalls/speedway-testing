package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateSchemaDocument(req rtmv1.UploadDocumentRequest, res *rtmv1.UploadDocumentResponse) (err error) {
	response, e := d.instance.CreateSchemaDocument(req)
	err = e

	if err != nil {
		res = &rtmv1.UploadDocumentResponse{}
		return
	}

	*res = response

	return
}

func (d *Daemon) GetSchemaDocument(req rtmv1.GetDocumentRequest, res *rtmv1.GetDocumentResponse) (err error) {
	response, e := d.instance.GetSchemaDocument(req)
	err = e

	if err != nil {
		res = &rtmv1.GetDocumentResponse{}
		return
	}

	*res = response

	return
}
