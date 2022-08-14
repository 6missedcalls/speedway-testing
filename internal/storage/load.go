package storage

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/ttacon/chalk"
)

// Loadkey loads a key from the ~/.speedway/keys directory
func LoadKey(name string) ([]byte, error) {
	var file *os.File
	if _, err := os.Stat(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/keys/"+name)); err != nil {
		if os.IsNotExist(err) {
			return nil, err
		}
		return nil, err
	}
	file, err := os.Open(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/keys/"+name))
	if err != nil {
		return nil, err
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	return data, err
}

// LoadInfo loads the account information from the ~/.speedway/info directory
func LoadInfo(name string) (string, error) {
	var file *os.File
	if _, err := os.Stat(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/info/"+name)); err != nil {
		if os.IsNotExist(err) {
			return "", err
		}
		return "", err
	}
	file, err := os.Open(fmt.Sprintf("%s/%s", os.Getenv("HOME"), ".speedway/info/"+name))
	if err != nil {
		return "", err
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	return string(data), err
}

// AutoLoadKey loads the key from the ~/.speedway/keys directory if it exists
// otherwise it returns an error

func AutoLoadKey() ([]byte, []byte, error) {
	aesKey, err := LoadKey("aes.key")
	if aesKey == nil || len(aesKey) != 32 {
		fmt.Println(chalk.Yellow, "Please add this device to your current account or make another account", chalk.Reset)
		return nil, nil, err
	}
	pskKey, err := LoadKey("psk.key")
	if pskKey == nil || len(pskKey) != 32 {
		fmt.Println(chalk.Yellow, "Please add this device to your current account or make another account", chalk.Reset)
		return nil, nil, err
	}
	return aesKey, pskKey, nil
}
