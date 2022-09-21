package routes

import "embed"

type ServerConfig struct {
	RPDisplayName string
	RPID          string
	RPOrigin      string
	StaticDir     string
	Address       string
	EmbedFs       *embed.FS
}

type ServerOptions = func(credCreationOpts *ServerConfig)
