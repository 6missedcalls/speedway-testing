package retrieve

import (
	"context"
	"fmt"

	"github.com/sonr-io/sonr/pkg/motor"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func GetObject(ctx context.Context, m motor.MotorNode, schemaDid string, cid string) (map[string]interface{}, error) {
	// Create new QueryWhatIs request for the object
	querySchema, err := m.QueryWhatIs(ctx, rtmv1.QueryWhatIsRequest{
		Creator: m.GetDID().String(),
		Did:     schemaDid,
	})
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
	querySchemaRes, err := m.QueryWhatIs(ctx, querySchemaReq)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return querySchemaRes, nil
}

// TODO: Add GetBucket when implemented
