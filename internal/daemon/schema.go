package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateSchema(req rtmv1.CreateSchemaRequest, res *rtmv1.CreateSchemaResponse) (err error) {
	response, e := d.instance.CreateSchema(req)
	err = e

	if err != nil {
		res = &rtmv1.CreateSchemaResponse{}
		return
	}

	*res = response

	return
}

func (d *Daemon) GetSchema(req rtmv1.QueryWhatIsRequest, res *rtmv1.QueryWhatIsResponse) (err error) {
	response, e := d.instance.GetSchema(req)
	err = e

	if err != nil {
		res = &rtmv1.QueryWhatIsResponse{}
		return
	}

	*res = response

	return
}

func (d *Daemon) GetSchemasByCreator(req rtmv1.QueryWhatIsByCreatorRequest, res *rtmv1.QueryWhatIsByCreatorResponse) (err error) {
	response, e := d.instance.Instance.QueryWhatIsByCreator(req)
	err = e

	if err != nil {
		res = &rtmv1.QueryWhatIsByCreatorResponse{}
		return
	}

	*res = *response

	return
}

func (d *Daemon) GetSchemaByDid(req rtmv1.QueryWhatIsRequest, res *rtmv1.QueryWhatIsResponse) (err error) {
	response, e := d.instance.Instance.QueryWhatIsByDid(req.Did)
	err = e

	if err != nil {
		res = &rtmv1.QueryWhatIsResponse{}
		return
	}

	*res = *response

	return
}
