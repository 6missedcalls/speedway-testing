package storage

import (
	"os"

	"github.com/sonr-io/sonr/pkg/motor"
)

// StoreKey stores the key in the ~/.speedway/key directory
func StoreKey(name string, key []byte) error {
	homedir, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	if _, err := os.Stat(homedir + "/.speedway/keys/" + name); os.IsNotExist(err) {
		err := os.MkdirAll(homedir+"/.speedway/keys/", 0700)
		if err != nil {
			return err
		}
	}
	store, err := os.Create(homedir + "/.speedway/keys/" + name)
	if err != nil {
		return err
	}
	_, err = store.Write(key)
	defer store.Close()
	return err
}

// StoreInfo stores the account information in the ~/.speedway/info directory
func StoreInfo(name string, m motor.MotorNode) error {
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
