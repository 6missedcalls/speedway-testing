package routes

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/duo-labs/webauthn/protocol"
	"github.com/duo-labs/webauthn/webauthn"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	_ "github.com/sonr-io/speedway/docs"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

var (
	RPDisplayName = "Sonr - Speedway"
	RPID          = "localhost"
	RPOrigin      = "http://localhost:8080"
)

type NebulaServer struct {
	Auth       *webauthn.WebAuthn
	Store      *userdb
	Router     *gin.Engine
	HttpServer *http.Server
	Config     *ServerConfig
}

func New(options ServerOptions) (*NebulaServer, error) {
	config := ServerConfig{}
	options(&config)

	webauthn, err := webauthn.New(&webauthn.Config{
		RPDisplayName:         RPDisplayName, // Display Name for your site
		RPID:                  RPID,          // Generally the domain name for your site
		RPOrigin:              RPOrigin,      // The origin URL for WebAuthn requests
		AttestationPreference: protocol.PreferDirectAttestation,
	})

	if err != nil {
		fmt.Printf("Error while creating auth instance %s", err.Error())
	}

	store := NewDB()

	srvr := NebulaServer{
		Auth:   webauthn,
		Store:  store,
		Router: gin.Default(),
		Config: &config,
	}

	srvr.HttpServer = &http.Server{
		Addr:    config.Address,
		Handler: srvr.Router,
	}

	return &srvr, nil
}

// @title           Speedway API
// @version         2.0
// @description     Create accounts, schemas, buckets and objects in a scalable way utilizing the Sonr architecture.
// @termsOfService  https://sonr.io/terms

// @contact.name   	API Support
// @contact.url    	https://sonr.io/
// @contact.email  	team@sonr.io

// @license.name 		OpenGLv3
// @license.url 		https://www.gnu.org/licenses/gpl-3.0.en.html

// @host      			localhost:8080
// @BasePath  			/api/v1
func (ns *NebulaServer) ConfigureRoutes() error {
	// * WebAuthn API routes (Working but currently disabled for testing) ** Thanks Josh :D **
	// ns.Router.GET("/api/webauthn/register-begin", ns.BeginRegistration)
	// ns.Router.POST("/api/webauthn/register-finish", ns.FinishRegistration)
	// ns.Router.GET("/api/webauthn/login-begin", ns.BeginLogin)
	// ns.Router.POST("/api/webauthn/login-finish", ns.FinishLogin)

	// * Account Routes
	ns.Router.POST("/api/v1/account/create", ns.CreateAccount)
	ns.Router.POST("/api/v1/account/login", ns.LoginAccount)
	ns.Router.GET("api/v1/account/info", ns.GetAccount)

	// * Alias Routes
	ns.Router.POST("/api/v1/alias/buy", ns.BuyAlias)
	ns.Router.POST("/api/v1/alias/sell", ns.SellAlias)
	ns.Router.POST("/api/v1/alias/transfer", ns.TransferAlias)

	// * Schema Routes
	ns.Router.POST("/api/v1/schema/create", ns.CreateSchema)
	ns.Router.POST("/api/v1/schema/get", ns.QuerySchema)

	// * Object Routes
	ns.Router.POST("/api/v1/object/build", ns.BuildObject)
	ns.Router.POST("/api/v1/object/get", ns.GetObject)

	// * Bucket Routes
	ns.Router.POST("/api/v1/bucket/create", ns.CreateBucket)
	ns.Router.POST("/api/v1/bucket/get", ns.GetBucket)
	ns.Router.POST("/api/v1/bucket/get-from-schema", ns.GetBucketBySchema)
	ns.Router.POST("/api/v1/bucket/update-items", ns.UpdateBucketItems)
	ns.Router.POST("/api/v1/bucket/update-label", ns.UpdateBucketLabel)
	ns.Router.POST("/api/v1/bucket/update-visibility", ns.UpdateBucketVisibility)

	// * Proxy Routes
	ns.Router.GET("/proxy/schemas", ns.ProxyQuerySchemas)
	ns.Router.GET("/proxy/buckets", ns.ProxyQueryBuckets)

	// * Serve Static Route
	ns.Router.Use(static.Serve("/", static.LocalFile(ns.Config.StaticDir, true)))
	ns.Router.Use(static.Serve("/schema", static.LocalFile(ns.Config.StaticDir, true)))
	ns.Router.Use(static.Serve("/objects", static.LocalFile(ns.Config.StaticDir, true)))
	ns.Router.Use(static.Serve("/buckets", static.LocalFile(ns.Config.StaticDir, true)))
	ns.Router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return nil
}

func (ns *NebulaServer) Serve() error {
	// Start Highway HTTP server on a separate goroutine
	go func() {
		// Start HTTP server (and proxy calls to gRPC server endpoint)
		if err := ns.HttpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			return
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	<-quit

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := ns.HttpServer.Shutdown(ctx); err != nil {
		return err
	}

	return nil
}
