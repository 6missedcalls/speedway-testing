package binding

import (
	"context"
	"fmt"
	"sync"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/sonr-io/speedway/internal/utils"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

type SpeedwayBinding struct {
	loggedIn bool
	instance mtr.MotorNode
}

var binding *SpeedwayBinding
var once sync.Once

/*
Initialize the speedway binding to the motor
*/
func InitMotor() mtr.MotorNode {
	fmt.Println(status.Debug, "Initializing motor...")

	hwid := utils.GetHwid()
	m := mtr.EmptyMotor(hwid)

	return m
}

/*
Here each function matches a function on the MotorNode for functionality being exposed to the cli and rest server there should be a          wrapper function definedon the SpeedwayMotorBindingSruct. the below functions are here to illustrate.
*/
func CreateInstance() *SpeedwayBinding {
	once.Do(func() {
		// create a motor node
		m := InitMotor()
		// create a binding instance
		binding = &SpeedwayBinding{
			loggedIn: false,
			instance: m,
		}
	})
	return binding
}

/*
Get the Instance of the motor node and return it
*/
func GetInstance() (*SpeedwayBinding, error) {
	if mtr := binding.instance; mtr != nil {
		return binding, nil
	}
	return nil, fmt.Errorf("cannot find instance of motor")
}

/*
Create Account on Blockchain and return the response
*/
func (b *SpeedwayBinding) CreateAccount(req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	res, err := b.instance.CreateAccount(req)
	if err != nil {
		return rtmv1.CreateAccountResponse{}, err
	}

	if storage.Store("psk.key", res.AesPsk) != nil {
		fmt.Println("Storage Error: ", err)
	}

	if storage.StoreInfo("address.snr", b.instance) != nil {
		fmt.Println("Storage Error: ", err)
	}

	return res, err
}

/*
Login and return the response
Set the logged in flag to true if successful
*/
func (b *SpeedwayBinding) Login(req rtmv1.LoginRequest) (rtmv1.LoginResponse, error) {
	res, err := b.instance.Login(req)
	if err != nil {
		fmt.Println("err", err)
	}

	if res.Success {
		b.loggedIn = true
	}

	return res, err
}

/*
Get the object and return a map of the object
*/
func (b *SpeedwayBinding) GetObject(ctx context.Context, schemaDid string, cid string) (map[string]interface{}, error) {
	// Create new QueryWhatIs request for the object
	querySchema, err := b.instance.QueryWhatIs(ctx, rtmv1.QueryWhatIsRequest{
		Creator: b.instance.GetDID().String(),
		Did:     schemaDid,
	})
	if err != nil {
		fmt.Println(status.Error, ("Error"), err)
		return nil, err
	}
	fmt.Printf("%v\n", querySchema.WhatIs)

	// Start a NewObjectBuilder (so we can call the GetByCID method)
	objBuilder, err := b.instance.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Println(status.Error, ("Error"), err)
		return nil, err
	}

	// Get the object by CID
	getObject, err := objBuilder.GetByCID(cid)
	if err != nil {
		fmt.Println(status.Error, ("Error"), err)
		return nil, err
	}

	return getObject, nil
}

/*
Get the schema and return the WhatIsResponse
*/
func (b *SpeedwayBinding) GetSchema(ctx context.Context, creator string, schemaDid string) (rtmv1.QueryWhatIsResponse, error) { // create new query schema request
	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: creator,
		Did:     schemaDid,
	}

	// query schema
	querySchemaRes, err := b.instance.QueryWhatIs(ctx, querySchemaReq)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return querySchemaRes, nil
}
