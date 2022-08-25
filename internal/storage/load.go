package storage

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/99designs/keyring"
	"github.com/ttacon/chalk"
)

func Load(name string) ([]byte, error) {
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

// AutoLoad loads the key from the ~/.speedway/keys directory if it exists
// otherwise it returns an error
func AutoLoad() ([]byte, []byte, error) {
	aesKey, err := LoadKeyring("aes.key")
	if aesKey.Data == nil || len(aesKey.Data) != 32 {
		fmt.Println(chalk.Yellow, "Please add this device to your current account or make another account", chalk.Reset)
		return nil, nil, err
	}
	pskKey, err := LoadKeyring("psk.key")
	if pskKey.Data == nil || len(pskKey.Data) != 32 {
		fmt.Println(chalk.Yellow, "Please add this device to your current account or make another account", chalk.Reset)
		return nil, nil, err
	}
	return aesKey.Data, pskKey.Data, nil
}

func LoadKeyring(name string) (keyring.Item, error) {
	ring, _ := keyring.Open(keyring.Config{
		ServiceName: "speedway",
	})

	key, err := ring.Get(name)
	if err != nil {
		return key, err
	}

	return key, nil
}
