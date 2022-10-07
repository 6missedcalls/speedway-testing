package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateBucket(req rtmv1.CreateBucketRequest, res *rtmv1.CreateBucketResponse) (err error) {
	response, _, err := d.instance.Instance.CreateBucket(req)
	if err != nil {
		return err
	}

	*res = rtmv1.CreateBucketResponse{
		Did:     response.Did,
		WhereIs: res.WhereIs,
	}

	return nil
}

func (d *Daemon) GetBucketsByCreator(req rtmv1.QueryWhereIsByCreatorRequest, res *rtmv1.QueryWhereIsByCreatorResponse) (err error) {
	r, e := d.instance.Instance.QueryWhereIsByCreator(req)
	*res = rtmv1.QueryWhereIsByCreatorResponse{
		Code:       r.Code,
		WhereIs:    r.WhereIs,
		Pagination: r.Pagination,
	}

	err = e
	return
}

func (d *Daemon) SearchBucketBySchema(req rtmv1.SeachBucketContentBySchemaRequest, res *rtmv1.SearchBucketContentBySchemaResponse) (err error) {
	r, e := d.instance.Instance.SeachBucketBySchema(req)

	*res = r
	err = e

	return
}

func (d *Daemon) GetBucketById(req rtmv1.QueryWhereIsRequest, res *rtmv1.QueryWhereIsResponse) (err error) {
	r, e := d.instance.Instance.QueryWhereIs(req)

	if e != nil {
		return e
	}

	*res = rtmv1.QueryWhereIsResponse{
		Code:    r.Code,
		WhereIs: r.WhereIs,
	}

	err = e

	return
}
