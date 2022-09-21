package daemon

// SessionInfo contains information about the daemon's session
type SessionInfo struct {
	Address  string
	LoggedIn bool
}

type GetSessionInfoRequest struct{}
type GetSessionInfoResponse struct {
	Info SessionInfo
}

func (d *Daemon) GetSessionInfo(req GetSessionInfoRequest, res *GetSessionInfoResponse) error {
	*res = GetSessionInfoResponse{
		Info: SessionInfo{
			Address:  d.instance.Instance.GetAddress(),
			LoggedIn: d.instance.GetLoggedIn(),
		},
	}
	return nil
}
