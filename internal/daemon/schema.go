package daemon

import (
	"context"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateSchema(req rtmv1.CreateSchemaRequest, res *rtmv1.CreateSchemaResponse) (err error) {
	*res, err = d.instance.CreateSchema(req)
	return
}

func (d *Daemon) GetSchema(req rtmv1.QuerySchemaRequest, res *rtmv1.QueryWhatIsResponse) (err error) {
	*res, err = d.instance.GetSchema(context.Background(), req.Creator, req.Did)
	return
}
