package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateSchemaDocument(req rtmv1.UploadDocumentRequest, res *rtmv1.UploadDocumentResponse) (err error) {
	response, err := d.instance.CreateSchemaDocument(req)

	res = &rtmv1.UploadDocumentResponse{
		Status:   response.Status,
		Did:      response.Did,
		Cid:      response.Cid,
		Document: response.Document,
	}

	return
}

func (d *Daemon) GetSchemaDocument(req rtmv1.GetDocumentRequest, res *rtmv1.GetDocumentResponse) (err error) {
	response, err := d.instance.GetSchemaDocument(req)

	res = &rtmv1.GetDocumentResponse{
		Status:   response.Status,
		Did:      response.Did,
		Cid:      response.Cid,
		Document: response.Document,
	}

	return
}
