package main

import (
	"fmt"
	"os"

	nebula "github.com/sonr-io/nebula/routes"
)

func main() {
	RPDisplayName := os.Getenv("RPDisplayName")
	RPID := os.Getenv("RPID")
	RPOrigin := os.Getenv("RPOrigin")
	Address := os.Getenv("Address")
	StaticDir := os.Getenv("StaticDir")

	chainInter, err := nebula.NewChain()

	if err != nil {
		fmt.Printf("Error while standing up server: %s", err.Error())
		return
	}

	srvr, err := nebula.New(func(options *nebula.ServerConfig) {
		options.RPDisplayName = RPDisplayName
		options.RPID = RPID
		options.RPOrigin = RPOrigin
		options.Address = Address
		options.StaticDir = StaticDir
		options.ChainIntr = &chainInter
	})

	if err != nil {
		fmt.Printf("Error while standing up web server: %s ", err)
	}

	err = srvr.ConfigureRoutes()
	if err != nil {
		fmt.Printf("Error while standing up web server: %s ", err)
	}

	srvr.Serve()
}