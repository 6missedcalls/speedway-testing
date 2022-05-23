module github.com/sonr-io/highway

go 1.16

replace (
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	github.com/ipfs/go-ipfs-blockstore => github.com/ipfs/go-ipfs-blockstore v1.1.2
	github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4
)

require (
	github.com/cloudflare/cfssl v1.6.1
	github.com/duo-labs/webauthn v0.0.0-20220330035159-03696f3d4499
	github.com/duo-labs/webauthn.io v0.0.0-20200929144140-c031a3e0f95d
	github.com/patrickmn/go-cache v2.1.0+incompatible
	github.com/sonr-io/sonr v0.0.2
)
