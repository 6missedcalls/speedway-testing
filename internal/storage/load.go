package storage

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/99designs/keyring"
	"github.com/ttacon/chalk"
)

/*
The Load function loads the specified key from the keyring
*/
func Load(name string) (keyring.Item, error) {
	ring, _ := keyring.Open(keyring.Config{
		ServiceName: "Sonr Speedway",
	})

	key, err := ring.Get(name)
	if err != nil {
		return key, err
	}

	return key, nil
}

/*
LoadInfo loads the account information from the ~/.speedway/info directory
*/
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

/*
AutoLoad utilizes the Load function to load the specified key from the keyring
*/
func AutoLoad() ([]byte, []byte, error) {
	aesKey, err := Load("dsc")
	if aesKey.Data == nil || len(aesKey.Data) != 32 {
		fmt.Println(chalk.Yellow, "Please add this device to your current account or make another account", chalk.Reset)
		return nil, nil, err
	}
	pskKey, err := Load("psk")
	if pskKey.Data == nil || len(pskKey.Data) != 32 {
		fmt.Println(chalk.Yellow, "Please add this device to your current account or make another account", chalk.Reset)
		return nil, nil, err
	}
	return aesKey.Data, pskKey.Data, nil
}
