package storage

import (
	"os"

	mtr "github.com/sonr-io/sonr/pkg/motor"
)

/*
The StoreInfo function stores the specified key in the ~/.speedway/info directory
*/
func StoreInfo(name string, m mtr.MotorNode) error {
	homedir, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	if _, err := os.Stat(homedir + "/.speedway/info/" + name); os.IsNotExist(err) {
		err := os.MkdirAll(homedir+"/.speedway/info/", 0700)
		if err != nil {
			return err
		}
	}

	file, err := os.Create(homedir + "/.speedway/info/" + name)
	if err != nil {
		return err
	}

	address := m.GetAddress()

	// write to the file with the address and did document in json format and close the file
	_, err = file.WriteString(address)
	if err != nil {
		return err
	}

	return err
}
