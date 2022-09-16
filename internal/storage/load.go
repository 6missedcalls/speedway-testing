package storage

import (
	"fmt"
	"io/ioutil"
	"os"
)

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
