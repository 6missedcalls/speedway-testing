package routes

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"time"

	"github.com/duo-labs/webauthn/protocol"
	"github.com/duo-labs/webauthn/webauthn"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/pkg/browser"
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

	ns.Router.GET("/api/v1/alias/get/:alias", ns.GetAlias)

	// * Schema Routes
	ns.Router.POST("/api/v1/schema/create", ns.CreateSchema)
	ns.Router.POST("/api/v1/schema/get", ns.QuerySchema)

	// * Schema Document Routes
	ns.Router.POST("/api/v1/schema-document/create", ns.CreateSchemaDocument)
	ns.Router.POST("/api/v1/schema-document/get", ns.GetSchemaDocument)

	// ! Deprecated Routes (Will be removed in future versions)
	// ! Object Routes
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
	ns.Router.POST("/api/v1/schema/get-from-creator", ns.QuerySchemaByCreator)
	ns.Router.POST("/api/v1/bucket/get-from-creator", ns.QueryBucketByCreator)

	// * Serve Static Route
	if ns.Config.EmbedFs != nil {
		ns.Router.Use(static.Serve("/", EmbedFolder(*ns.Config.EmbedFs, ns.Config.StaticDir)))
		ns.Router.Use(static.Serve("/schema", EmbedFolder(*ns.Config.EmbedFs, ns.Config.StaticDir)))
		ns.Router.Use(static.Serve("/objects", EmbedFolder(*ns.Config.EmbedFs, ns.Config.StaticDir)))
		ns.Router.Use(static.Serve("/buckets", EmbedFolder(*ns.Config.EmbedFs, ns.Config.StaticDir)))
	} else {
		ns.Router.Use(static.Serve("/", static.LocalFile(ns.Config.StaticDir, true)))
		ns.Router.Use(static.Serve("/schema", static.LocalFile(ns.Config.StaticDir, true)))
		ns.Router.Use(static.Serve("/objects", static.LocalFile(ns.Config.StaticDir, true)))
		ns.Router.Use(static.Serve("/buckets", static.LocalFile(ns.Config.StaticDir, true)))

	}
	ns.Router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	return nil
}

func (ns *NebulaServer) Serve(openInBrowser bool) error {
	if openInBrowser {
		go func() {
			time.Sleep(1 * time.Second)
			browser.OpenURL("http://localhost:4040")
		}()
	}

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

func open(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}

type embedFileSystem struct {
	http.FileSystem
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	if err != nil {
		return false
	}
	return true
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		panic(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(fsys),
	}
}
