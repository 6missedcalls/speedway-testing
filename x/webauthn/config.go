package webauthn

import (
	"github.com/duo-labs/webauthn/webauthn"
	"github.com/sonr-io/sonr/pkg/config"
)

// WebauthnConfig returns the configuration for the WebAuthn module
func toWebauthnConfig(c *config.Config) *webauthn.Config {
	return &webauthn.Config{
		RPDisplayName: c.WebAuthNRPDisplayName,
		RPID:          c.WebAuthNRPID,
		RPOrigin:      c.WebAuthNRPOrigin,
		RPIcon:        c.WebAuthNRPIcon,
		Debug:         c.WebAuthNDebug,
	}

}
