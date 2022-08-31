package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/motor/x/object"
	"github.com/sonr-io/speedway/internal/binding"
)

type GetObject struct {
	SchemaDid string `json:"schemaDid"`
	ObjectCid string `json:"objectCid"`
}

type GetObjectResponse struct {
	Object *object.Object `json:"object"`
}

// @BasePath /api/v1
// @Summary GetObject
// @Schemes
// @Description Get an object on Sonr using the object module of Sonr's Blockchain.
// @Tags object
// @Produce json
// @Param 		 SchemaDid body string true "SchemaDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 ObjectCid body string true "ObjectCid" example("bafyreigfzxrtvfzuaoyhn5vgndneeeirq62efgf2s3igmoenxgx7jxy2cm")
// @Success 200 {object} GetObjectResponse
// @Failure      500  {object} FailedResponse
// @Router /object/get [post]
func (ns *NebulaServer) GetObject(c *gin.Context) {
	rBody := c.Request.Body
	var body GetObject
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
		})
		return
	}

	m := binding.CreateInstance()

	ctx := context.Background()

	object, err := m.GetObject(ctx, body.SchemaDid, body.ObjectCid)
	if err != nil {
		fmt.Printf("GetObject failed %v\n", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK,
		GetObjectResponse{
			Object: object,
		})
}
