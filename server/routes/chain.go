package nebula

import (
	"context"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/sonr-io/sonr/x/registry/types"
	"google.golang.org/grpc"
)

type Chain interface {
	QueryWhoIs(did string) (*types.WhoIs, error)
	Cleanup() error
}

type chainImpl struct {
	rpcClient *grpc.ClientConn
}

func NewChain() (Chain, error) {
	// Create a connection to the gRPC server.
	rpcAddr, addrFound := os.LookupEnv("SONR_RPC_ADDR_PUBLIC")
	if !addrFound {
		return &chainImpl{}, errors.New("error creating chain")
	}
	grpcConn, err := grpc.Dial(rpcAddr, grpc.WithInsecure())
	if err != nil {
		return nil, err
	}

	return &chainImpl{
		rpcClient: grpcConn,
	}, nil
}

func (c *chainImpl) QueryWhoIs(did string) (*types.WhoIs, error) {
	queryFn := func() (interface{}, error) {
		return types.NewQueryClient(c.rpcClient).WhoIs(context.Background(), &types.QueryWhoIsRequest{Did: did})
	}

	v, err := retry(3, time.Second*3, queryFn)
	if err != nil {
		return nil, err
	}

	reply, ok := v.(*types.QueryWhoIsResponse)
	if !ok {
		return nil, fmt.Errorf("error converting to QueryWhoIsResponse: %s", v)
	}

	return reply.WhoIs, nil
}

func (c *chainImpl) Cleanup() error {
	return c.rpcClient.Close()
}

func retry(count int, timeout time.Duration, fn func() (interface{}, error)) (interface{}, error) {
	var err error
	var v interface{}
	for i := 0; i < count; i += 1 {
		v, err = fn()
		if err == nil {
			return v, err
		}

		time.Sleep(timeout)
		timeout *= 2
	}
	return nil, err
}
