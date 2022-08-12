package retrieve

import (
	"context"
	"fmt"

	"github.com/sonr-io/sonr/pkg/motor"
	"github.com/ttacon/chalk"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

func GetObject(m motor.MotorNode, schemaDid string, cid string) (map[string]interface{}, error) {

	querySchema, err := m.QueryWhatIs(context.Background(), rtmv1.QueryWhatIsRequest{
		Creator: m.GetDID().String(),
		Did:     schemaDid,
	})
	if err != nil {
		fmt.Println(chalk.Red.Color("Error"), err)
		return nil, err
	}
	fmt.Printf("%v\n", querySchema.WhatIs)

	objBuilder, err := m.NewObjectBuilder(schemaDid)
	if err != nil {
		fmt.Println(chalk.Red.Color("Error"), err)
		return nil, err
	}

	getObject, err := objBuilder.GetByCID(cid)
	if err != nil {
		fmt.Println(chalk.Red.Color("Error"), err)
		return nil, err
	}
	fmt.Println(chalk.Green.Color("Successfuly retrieved object"))

	return getObject, nil
}

func GetSchema(m motor.MotorNode, creator string, schemaDid string) (rtmv1.QueryWhatIsResponse, error) {
	// create new query schema request
	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: creator,
		Did:     schemaDid,
	}

	// query schema
	querySchemaRes, err := m.QueryWhatIs(context.Background(), querySchemaReq)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return rtmv1.QueryWhatIsResponse{}, err
	}

	return querySchemaRes, nil
}
