package daemon

import (
	"context"

	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateBucket(req rtmv1.CreateBucketRequest, res *rtmv1.CreateBucketResponse) (err error) {
	response, e := d.instance.Instance.CreateBucket(context.Background(), req)
	err = e

	if err != nil {
		res = &rtmv1.CreateBucketResponse{}
		return err
	}

	*res = rtmv1.CreateBucketResponse{
		Did: response.GetDID(),
	}

	return nil
}

func (d *Daemon) GetBucketsByCreator(req rtmv1.QueryWhereIsByCreatorRequest, res *rtmv1.QueryWhereIsByCreatorResponse) (err error) {
	response, e := d.instance.Instance.QueryWhereIsByCreator(req)
	err = e

	if err != nil {
		*res = rtmv1.QueryWhereIsByCreatorResponse{}
		return
	}

	*res = *response

	return
}

func (d *Daemon) SearchBucketBySchema(req rtmv1.SeachBucketContentBySchemaRequest, res *rtmv1.SearchBucketContentBySchemaResponse) (err error) {
	response, e := d.instance.Instance.SeachBucketBySchema(req)
	err = e

	if err != nil {
		*res = rtmv1.SearchBucketContentBySchemaResponse{}
		return err
	}

	*res = response

	return
}

func (d *Daemon) GetBucketById(req rtmv1.QueryWhereIsRequest, res *rtmv1.QueryWhereIsResponse) (err error) {
	response, e := d.instance.Instance.QueryWhereIs(req)
	err = e

	if err != nil {
		*res = rtmv1.QueryWhereIsResponse{}
		return e
	}

	*res = *response

	return
}
