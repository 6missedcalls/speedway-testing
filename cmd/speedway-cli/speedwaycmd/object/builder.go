package object

import (
	"context"
	"fmt"
	"math"
	"strconv"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	"github.com/sonr-io/sonr/pkg/motor/x/object"
	rtmv1 "github.com/sonr-io/sonr/third_party/types/motor/api/v1"
	"github.com/sonr-io/sonr/x/schema/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

// Method to build an object
// Command Example: speedway object build
func BootstrapBuildObjectCommand(ctx context.Context, logger *golog.Logger) (buildObjCmd *cobra.Command) {
	buildObjCmd = &cobra.Command{
		Use:   "build",
		Short: "Build a new object on the Sonr Network.",
		Long: `Build a new object on the Sonr Network.
		You can create a new object via the command line prompts or by passing in the corresponding values to the --did, --file, and --label flags.`,
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf(status.Error("Error: %s"), err)
				return
			}
			if loginResult.Success {
				logger.Infof(status.Success("Login successful"))
			} else {
				logger.Fatalf(status.Error("Login failed"))
				return
			}

			creatorDid := m.GetDID()
			if err != nil {
				logger.Fatalf(status.Error("Error: %s"), err)
				return
			}

			var schemaDid string
			if schemaDid, err = cmd.Flags().GetString("did"); err == nil && schemaDid == "" {
				schemaDid = (&prompter.Prompter{
					Message: "Enter the DID of the schema you want to use to build the object",
				}).Prompt()
				if schemaDid == "" {
					logger.Fatalf(status.Error("Error: %s"), "Schema DID cannot be empty")
					return
				}
			}

			// query whatis req
			querySchemaReq := rtmv1.QueryWhatIsRequest{
				Creator: creatorDid.String(),
				Did:     schemaDid,
			}

			querySchema, err := m.QueryWhatIs(querySchemaReq)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			logger.Infof("Schema: %s", querySchema)

			// create new object builder
			objBuilder, err := m.NewObjectBuilder(schemaDid)
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			if label, err := cmd.Flags().GetString("label"); err == nil && label == "" {
				label = (&prompter.Prompter{
					Message: "Enter the label for the object",
				}).Prompt()
				objBuilder.SetLabel(label)
			} else {
				objBuilder.SetLabel(label)
			}

			if filePath, err := cmd.Flags().GetString("file"); err == nil && filePath == "" {

				for _, field := range querySchema.Schema.Fields {
					value := (&prompter.Prompter{
						Message: "Enter the value for the " + field.Name + " field",
					}).Prompt()
					err = setNormalizedValueFromPrompt(objBuilder, field, value)
					if err != nil {
						fmt.Printf("Command failed %v\n", err)
						return
					}
				}
			} else {
				def, err := utils.LoadObjectDefinitionFromDisk(filePath)
				if err != nil {
					logger.Fatalf("error while attempting to load object definition: %s", err)
				}

				for k, v := range def {
					// TODO: this is a hack, for floats to typecast to int type, will throw bad things if it cant. which means it should stay a float.
					// using the error on the typecast to know when something "is" a float.
					switch v.(type) {
					case float32:
						value := float64(v.(float32))
						if _, rem := math.Modf(value); rem > 0 {
							objBuilder.Set(k, value)
						} else {
							objBuilder.Set(k, int(v.(float32)))
						}
						continue
					case float64:
						value := float64(v.(float64))
						if _, rem := math.Modf(value); rem > 0 {
							objBuilder.Set(k, value)
						} else {
							objBuilder.Set(k, int(v.(float64)))
						}
						continue
					}
					err := objBuilder.Set(k, v)
					if err != nil {
						logger.Errorf("Error while validating: %s: %s", k, err)
					}
				}
			}

			// build the object
			build, err := objBuilder.Build()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			buildStr, _ := utils.MarshalJsonFmt(build)
			logger.Debugf("Built: %s\n", buildStr)

			// upload the object
			upload, err := objBuilder.Upload()
			if err != nil {
				fmt.Printf("Command failed %v\n", err)
				return
			}
			uploadStr, _ := utils.MarshalJsonFmt(upload)
			fmt.Printf("Upload: %v\n", uploadStr)
		},
	}

	buildObjCmd.PersistentFlags().String("did", "", "identifier of a schema to associate with the object")
	buildObjCmd.PersistentFlags().String("file", "", "path to an object definition matching a provided schema")
	buildObjCmd.PersistentFlags().String("label", "", "given label for the object being built")
	return
}

func setNormalizedValueFromPrompt(builder *object.ObjectBuilder, field *types.SchemaKindDefinition, value string) error {
	switch field.GetKind() {
	case types.SchemaKind_STRING:
		return builder.Set(field.Name, value)
	case types.SchemaKind_INT:
		intValue, err := strconv.Atoi(value)
		if err != nil {
			return err
		}
		return builder.Set(field.Name, intValue)
	case types.SchemaKind_FLOAT:
		floatValue, err := strconv.ParseFloat(value, 64)
		if err != nil {
			return err
		}
		return builder.Set(field.Name, floatValue)
	case types.SchemaKind_BOOL:
		boolValue, err := strconv.ParseBool(value)
		if err != nil {
			return err
		}
		return builder.Set(field.Name, boolValue)
	default:
		return fmt.Errorf("Parsing the %s IPLD type has not been implemented yet in speedway.", field.GetKind())
	}
}
