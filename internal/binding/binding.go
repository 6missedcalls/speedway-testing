package binding

import (
	"context"
	"fmt"
	"sync"

	"github.com/sonr-io/sonr/pkg/did"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/sonr-io/sonr/pkg/motor/x/object"
	"github.com/sonr-io/sonr/third_party/types/common"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	btv1 "github.com/sonr-io/sonr/x/bucket/types"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/storage"
	"github.com/sonr-io/speedway/internal/utils"
)

var (
	ErrMotorNotInitialized = fmt.Errorf("cannot find instance of motor")
	ErrNotAuthenticated    = fmt.Errorf("must be logged in to preform that action")
	ErrIsAuthenticated     = fmt.Errorf("you are already authenticated")
	ErrMotorFailedInit     = fmt.Errorf("motor failed to initialize")
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
	initreq := &rtmv1.InitializeRequest{
		DeviceId: utils.GetHwid(),
	}
	m, err := mtr.EmptyMotor(initreq, common.DefaultCallback())
	if err != nil {
		fmt.Println(status.Error("Motor failed to initialize"), err)
		return nil
	}
	return m
}

/*
Here each function matches a function on the MotorNode for functionality being exposed to the cli and rest server there should be a wrapper function definedon the SpeedwayMotorBindingSruct.
*/
func CreateInstance() *SpeedwayBinding {
	once.Do(func() {
		binding = &SpeedwayBinding{}
		m := InitMotor()
		binding.instance = m
	})
	return binding
}

/*
Get the Instance of the motor node and return it
*/
func GetInstance() (*SpeedwayBinding, error) {
	if binding.instance == nil {
		return nil, ErrMotorNotInitialized
	}

	return binding, ErrMotorNotInitialized
}

/*
Create Account on Blockchain and return the response
*/
func (b *SpeedwayBinding) CreateAccount(req rtmv1.CreateAccountRequest) (rtmv1.CreateAccountResponse, error) {
	res, err := b.instance.CreateAccount(req)
	if err != nil {
		fmt.Println(status.Error("Create Account Error"), err)
	}

	psk, err := storage.Store("psk", res.AesPsk)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
	}
	fmt.Println(status.Info, "PSK stored in keyring", psk)

	if storage.StoreInfo("address.snr", b.instance) != nil {
		fmt.Println(status.Error("Storage Error: "), err)
	}

	return res, err
}

/*
Login and return the response
Set the logged in flag to true if successful
*/
func (b *SpeedwayBinding) Login(req rtmv1.LoginRequest) (rtmv1.LoginResponse, error) {
	if b.instance == nil {
		return rtmv1.LoginResponse{}, ErrMotorNotInitialized
	}
	if b.loggedIn {
		fmt.Println(status.Info, "You are already logged in")
	}

	res, err := b.instance.Login(req)
	if err != nil {
		fmt.Println(status.Error("Login Error"), err)
	}

	b.loggedIn = true

	return res, err
}

/*
Get the object and return a map of the object
*/
func (b *SpeedwayBinding) GetObject(ctx context.Context, schemaDid string, cid string) (*object.Object, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	queryObjectReq := rtmv1.QueryWhatIsRequest{
		Creator: b.instance.GetDID().String(),
		Did:     schemaDid,
	}

	// Create new QueryWhatIs request for the object
	querySchema, err := b.instance.QueryWhatIs(queryObjectReq)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}
	fmt.Printf("%v\n", querySchema.WhatIs)

	// Start a NewObjectBuilder (so we can call the GetByCID method)
	objBuilder, err := b.instance.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	// Get the object by CID
	getObject, err := objBuilder.GetByCID(cid)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	return &getObject, nil
}

/*
Get the schema and return the WhatIsResponse
*/
func (b *SpeedwayBinding) GetSchema(ctx context.Context, creator string, schemaDid string) (rtmv1.QueryWhatIsResponse, error) {
	if b.instance == nil {
		return rtmv1.QueryWhatIsResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.QueryWhatIsResponse{}, ErrNotAuthenticated
	}

	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: creator,
		Did:     schemaDid,
	}

	// query schema
	querySchemaRes, err := b.instance.QueryWhatIs(querySchemaReq)
	if err != nil {
		fmt.Printf("Binding failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return *querySchemaRes, nil
}

/*
Get a list of BucketItems from the bucket and return the list
*/
func (b *SpeedwayBinding) GetBuckets(ctx context.Context, bucketDid string) ([]*btv1.BucketItem, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	res, err := b.instance.GetBucket(bucketDid)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	content := res.GetBucketItems()
	if content == nil {
		return nil, nil
	}

	return content, nil
}

/*
Get a bucket with an associated schema and return the response
*/
func (b *SpeedwayBinding) GetBucketFromSchema(ctx context.Context, req rtmv1.SeachBucketContentBySchemaRequest) (rtmv1.SearchBucketContentBySchemaResponse, error) {
	if b.instance == nil {
		return rtmv1.SearchBucketContentBySchemaResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.SearchBucketContentBySchemaResponse{}, ErrNotAuthenticated
	}

	res, err := b.instance.SeachBucketBySchema(req)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return rtmv1.SearchBucketContentBySchemaResponse{}, err
	}

	return res, nil
}

/*
Create the schema and return the WhatIsResponse
*/
func (b *SpeedwayBinding) CreateSchema(req rtmv1.CreateSchemaRequest) (rtmv1.CreateSchemaResponse, error) {
	if b.instance == nil {
		return rtmv1.CreateSchemaResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.CreateSchemaResponse{}, ErrNotAuthenticated
	}

	res, err := b.instance.CreateSchema(req)
	if err != nil {
		fmt.Printf("Binding failed %v\n", err)
		return rtmv1.CreateSchemaResponse{}, err
	}

	return res, nil
}

/*
Create the bucket and return the WhereIsResponse
*/
func (b *SpeedwayBinding) CreateBucket(ctx context.Context, req rtmv1.CreateBucketRequest) ([]*btv1.BucketItem, did.Service, error) {
	if b.instance == nil {
		return nil, did.Service{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, did.Service{}, ErrNotAuthenticated
	}

	res, err := b.instance.CreateBucket(ctx, req)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, did.Service{}, err
	}

	serv := res.CreateBucketServiceEndpoint()
	fmt.Println(status.Info, "Service Endpoint", serv)

	bucket := res.GetBucketItems()

	return bucket, serv, nil
}

/*
NewObjectBuilder and return the ObjectBuilder
*/
func (b *SpeedwayBinding) NewObjectBuilder(schemaDid string) (*object.ObjectBuilder, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	objBuilder, err := b.instance.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Println(status.Error("Binding failed %v\n"), err)
		return nil, err
	}

	return objBuilder, nil
}

/*
UpdateBucketItems and return the bucket after the update
*/
func (b *SpeedwayBinding) UpdateBucketItems(ctx context.Context, bucketDid string, items []*btv1.BucketItem) ([]*btv1.BucketItem, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	res, err := b.instance.UpdateBucketItems(ctx, bucketDid, items)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	content := res.GetBucketItems()
	if content == nil {
		return nil, fmt.Errorf("no bucket items found")
	}

	return content, nil
}

/*
UpdateBucketLabel and return the bucket after the update
*/
func (b *SpeedwayBinding) UpdateBucketLabel(ctx context.Context, bucketDid string, label string) (*rtmv1.QueryWhereIsResponse, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	res, err := b.instance.UpdateBucketLabel(ctx, bucketDid, label)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	// query whereis
	wReq := rtmv1.QueryWhereIsRequest{
		Creator: res.GetCreator(),
		Did:     res.GetDID(),
	}

	whereIs, err := b.instance.QueryWhereIs(wReq)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	return whereIs, nil
}

/*
UpdateBucketVisibility and return the bucket after the update
*/
func (b *SpeedwayBinding) UpdateBucketVisibility(ctx context.Context, bucketDid string, visibility *btv1.BucketVisibility) (*rtmv1.QueryWhereIsResponse, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	res, err := b.instance.UpdateBucketVisibility(ctx, bucketDid, *visibility)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	wReq := rtmv1.QueryWhereIsRequest{
		Creator: res.GetCreator(),
		Did:     res.GetDID(),
	}

	whereIs, err := b.instance.QueryWhereIs(wReq)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return nil, err
	}

	return whereIs, nil
}

/*
GetContentById and return the content
*/
func (b *SpeedwayBinding) GetContentById(ctx context.Context, bucketDid string, contentId string) (*btv1.BucketContent, error) {
	if b.instance == nil {
		return &btv1.BucketContent{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return &btv1.BucketContent{}, ErrNotAuthenticated
	}

	bucket, err := b.instance.GetBucket(bucketDid)
	if err != nil {
		fmt.Println(status.Error("GetBucket Error:"), err)
		return &btv1.BucketContent{}, err
	}

	content, err := bucket.GetContentById(contentId)
	if err != nil {
		fmt.Println(status.Error("GetContent Error:"), err)
		return &btv1.BucketContent{}, err
	}

	return content, nil
}

/*
QueryWhatIs and return the WhatIsResponse
*/
func (b *SpeedwayBinding) QuerySchema(ctx context.Context, req rtmv1.QueryWhatIsRequest) (rtmv1.QueryWhatIsResponse, error) {
	if b.instance == nil {
		return rtmv1.QueryWhatIsResponse{}, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return rtmv1.QueryWhatIsResponse{}, ErrNotAuthenticated
	}

	schemaResponse, err := b.instance.QueryWhatIs(req)
	if err != nil {
		fmt.Println(status.Error("Error"), err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return *schemaResponse, nil
}

/*
GetDID and return the DID
*/
func (b *SpeedwayBinding) GetDID() (*did.DID, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}

	did := b.instance.GetDID()
	return &did, nil
}

/*
GetDidDocument and return the DidDocument
*/
func (b *SpeedwayBinding) GetDidDocument() (*did.Document, error) {
	if b.instance == nil {
		return nil, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return nil, ErrNotAuthenticated
	}

	didDoc := b.instance.GetDIDDocument()
	if didDoc == nil {
		return nil, ErrNotAuthenticated
	}

	return &didDoc, nil
}

/*
GetAddress and return the address
*/
func (b *SpeedwayBinding) GetAddress() (string, error) {
	if b.instance == nil {
		return "", ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return "", ErrNotAuthenticated
	}

	address := b.instance.GetAddress()
	if address == "" {
		return "", ErrNotAuthenticated
	}

	return address, nil
}

/*
GetBalance and return the balance
*/
func (b *SpeedwayBinding) GetBalance() (int64, error) {
	if b.instance == nil {
		return 0, ErrMotorNotInitialized
	}
	if !b.loggedIn {
		return 0, ErrNotAuthenticated
	}

	balance := b.instance.GetBalance()

	return balance, nil
}
