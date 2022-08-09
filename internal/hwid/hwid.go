package hwid

import (
	"github.com/denisbrodbeck/machineid"
)

func GetHwid() (string, error) {
	hwid, err := machineid.ID()
	if err != nil {
		return "", err
	}
	return hwid, nil
}
