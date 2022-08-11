package hwid

import (
	"github.com/denisbrodbeck/machineid"
)

func GetHwid() string {
	hwid, err := machineid.ID()
	if err != nil {
		return "Error getting hwid"
	}
	return hwid
}
