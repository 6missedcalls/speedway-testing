package daemon

import (
	"fmt"
	"github.com/sonr-io/speedway/internal/binding"
	"net"
	"net/rpc"
)

var (
	kill    chan bool
	handler *Daemon
)

type Daemon struct {
	instance *binding.SpeedwayBinding
}

func NewHandler() (*Daemon, error) {
	h := new(Daemon)
	if err := rpc.Register(h); err != nil {
		return nil, fmt.Errorf("register rpc handler: %s", err)
	}

	return h, nil
}

func Start(port int) error {
	fmt.Printf("Starting daemon on port %d... ", port)
	l, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return fmt.Errorf("start RPC server: %s", err)
	}

	handler, err = NewHandler()
	if err != nil {
		return err
	}
	handler.instance = binding.CreateInstance()
	kill = make(chan bool)

	go func() {
		for {
			rpc.Accept(l)
		}
	}()
	fmt.Println("done.")

	<-kill
	fmt.Println("Killing daemon...")
	return nil
}
