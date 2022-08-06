package nebula

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
	mtr "github.com/sonr-io/sonr/pkg/motor"
	rtmv1 "go.buf.build/grpc/go/sonr-io/motor/api/v1"
)

// create a struct to hold the command line flags for the command
type CreateSchemaRequest struct {
	SchemaLabel  string   `json:"label"`
	SchemaFields []string `json:"fields"`
}

func (ns *NebulaServer) CreateSchema(c *gin.Context) {
	rBody := c.Request.Body
	var r CreateSchemaRequest
	err := json.NewDecoder(rBody).Decode(&r)
	if err != nil {
		c.JSON(400, gin.H{
			"error": "Invalid request body",
		})
		return
	}
	// create a new schema request object
	req := (rtmv1.CreateSchemaRequest{
		Label:  r.SchemaLabel,
		Fields: r.SchemaFields,
	})
	// create the motor
	m := mtr.EmptyMotor("Test_Device")
	// create the schema
	res, err := m.CreateSchema(req)
	if err != nil {
		c.JSON(500, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"schema": res,
	})
}
