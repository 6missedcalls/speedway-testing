package nebula

type ServerConfig struct {
	RPDisplayName string
	RPID          string
	RPOrigin      string
	StaticDir     string
	Address       string
}

type ServerOptions = func(credCreationOpts *ServerConfig)
