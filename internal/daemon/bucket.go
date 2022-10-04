package daemon

import (
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
)

func (d *Daemon) CreateBucket(req rtmv1.CreateBucketRequest, res *rtmv1.CreateBucketResponse) (err error) {
	r, b, e := d.instance.Instance.CreateBucket(req)
	if e != nil {
		return e
	}

	if b != nil {
		return e
	}

	*res = *r
	return
}

func (d *Daemon) GetBucketsByCreator(req rtmv1.QueryWhereIsByCreatorRequest, res *rtmv1.QueryWhereIsByCreatorResponse) (err error) {
	r, e := d.instance.Instance.QueryWhereIsByCreator(req)
	*res = *r
	err = e
	return
}

func (d *Daemon) GetBucketById(req rtmv1.QueryWhereIsRequest, res *rtmv1.QueryWhereIsResponse) (err error) {
	r, e := d.instance.Instance.QueryWhereIs(req)
	*res = *r
	err = e
	return
}
