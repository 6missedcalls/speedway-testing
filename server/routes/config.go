package routes

import (
	"embed"

	"github.com/sonr-io/speedway/internal/binding"
)

type ServerConfig struct {
	RPDisplayName string
	RPID          string
	RPOrigin      string
	StaticDir     string
	Address       string
	Binding       *binding.SpeedwayBinding
	EmbedFs       *embed.FS
}

type ServerOptions = func(credCreationOpts *ServerConfig)
