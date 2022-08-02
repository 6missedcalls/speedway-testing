package nebula

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
)

var (
	RPDisplayName = "Sonr - Highway"
	RPID          = "localhost"
	RPOrigin      = "http://localhost:8080"
)

type NebulaServer struct {
	Auth       *webauthn.WebAuthn
	Store      *userdb
	Router     *gin.Engine
	HttpServer *http.Server
	Config     *ServerConfig
	ChainIntr  *Chain
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
		Auth:      webauthn,
		Store:     store,
		Router:    gin.Default(),
		Config:    &config,
		ChainIntr: config.ChainIntr,
	}

	srvr.HttpServer = &http.Server{
		Addr:    config.Address,
		Handler: srvr.Router,
	}

	return &srvr, nil
}

func (ns *NebulaServer) ConfigureRoutes() error {
	ns.Router.GET("/api/webauthn/register-begin", ns.BeginRegistration)
	ns.Router.POST("/api/webauthn/register-finish", ns.FinishRegistration)
	ns.Router.GET("/api/webauthn/login-begin", ns.BeginLogin)
	ns.Router.POST("/api/webauthn/login-finish", ns.FinishLogin)
	ns.Router.POST("/api/v1/account/create", ns.CreateAccount)
	ns.Router.POST("/api/v1/account/login", ns.LoginAccount)

	// not great, but we dont want to dupllicate the build folder.
	ns.Router.Use(static.Serve("/", static.LocalFile(ns.Config.StaticDir, true)))

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