package retrieve

import (
	"context"
	"fmt"

	"github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/ttacon/chalk"
)

func GetObject(ctx context.Context, m motor.MotorNode, schemaDid string, cid string) (map[string]interface{}, error) {
	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: m.GetDID().String(),
		Did:     schemaDid,
	}

	// Create new QueryWhatIs request for the object
	querySchema, err := m.QuerySchema(querySchemaReq)
	if err != nil {
		fmt.Println(chalk.Red.Color("Error"), err)
		return nil, err
	}
	fmt.Printf("%v\n", querySchema.WhatIs)

	// Start a NewObjectBuilder (so we can call the GetByCID method)
	objBuilder, err := m.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Println(chalk.Red.Color("Error"), err)
		return nil, err
	}

	// Get the object by CID
	getObject, err := objBuilder.GetByCID(cid)
	if err != nil {
		fmt.Println(chalk.Red.Color("Error"), err)
		return nil, err
	}

	return getObject, nil
}

func GetSchema(ctx context.Context, m motor.MotorNode, creator string, schemaDid string) (rtmv1.QueryWhatIsResponse, error) {
	// create new query schema request
	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: creator,
		Did:     schemaDid,
	}

	// query schema
	querySchemaRes, err := m.QuerySchema(querySchemaReq)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return *querySchemaRes, nil
}

// TODO: Add GetBucket when implemented
