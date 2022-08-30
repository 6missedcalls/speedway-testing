package routes

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sonr-io/sonr/pkg/motor/x/object"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor"
	"github.com/sonr-io/speedway/internal/binding"
)

type BuildObjectBody struct {
	SchemaDid string                 `json:"schemaDid"`
	Label     string                 `json:"label"`
	Object    map[string]interface{} `json:"object"`
}

type BuildObjectResponse struct {
	ObjectUpload *object.ObjectUploadResult `json:"objectUpload"`
}

// @BasePath /api/v1
// @Summary BuildObject
// @Schemes
// @Description Build an object on Sonr using the object module of Sonr's Blockchain.
// @Tags object
// @Produce json
// @Param 		 SchemaDid body string true "SchemaDid" example("did:sonr:172ljvam8m7xxlv59v6w27lula58zwwct3vgn9p")
// @Param 		 Label body string true "Label" example("MyObject")
// @Param 		 Object body map[string]interface{} true "Object" example({"name": "John Doe"})
// @Success 200 {object} object.ObjectReference
// @Failure      500  {object}  FailedResponse
// @Router /object/build [post]
func (ns *NebulaServer) BuildObject(c *gin.Context) {
	rBody := c.Request.Body
	var body BuildObjectBody
	err := json.NewDecoder(rBody).Decode(&body)
	if err != nil {
		c.JSON(http.StatusBadRequest, FailedResponse{
			Error: "Invalid request body",
		})
		return
	}

	label := body.Label
	// init motor
	m := binding.CreateInstance()

	// query whatis
	did, err := m.GetDID()
	if err != nil {
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to get DID",
		})
		return
	}

	// query whatis req
	querySchemaReq := rtmv1.QueryWhatIsRequest{
		Creator: did.String(),
		Did:     body.SchemaDid,
	}

	querySchema, err := m.QuerySchema(context.Background(), querySchemaReq)
	if err != nil {
		fmt.Printf("Command failed %v\n", err)
		return
	}
	fmt.Printf("Schema WhatIs Response %v\n", querySchema)

	// Initialize NewObjectBuilder
	objBuilder, err := m.NewObjectBuilder(body.SchemaDid)
	if err != nil {
		fmt.Println("ObjectBuilder Error: ", err)
		c.JSON(http.StatusUnprocessableEntity, FailedResponse{
			Error: "ObjectBuilder Error",
		})
	}

	objBuilder.SetLabel(label)

	// Iterate through object and add to builder
	for k, v := range body.Object {
		objBuilder.Set(k, v)
	}

	// Upload the object
	upload, err := objBuilder.Upload()
	if err != nil {
		fmt.Println("err", err)
		c.JSON(http.StatusInternalServerError, FailedResponse{
			Error: "Failed to upload object",
		})
	}
	c.JSON(http.StatusOK, BuildObjectResponse{
		ObjectUpload: upload,
	})
}
