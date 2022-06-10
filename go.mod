module github.com/sonr-io/highway

go 1.16

replace (
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	github.com/ipfs/go-ipfs-blockstore => github.com/ipfs/go-ipfs-blockstore v1.1.2
	github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4
)

require (
	github.com/cosmos/btcutil v1.0.4
	github.com/duo-labs/webauthn v0.0.0-20220330035159-03696f3d4499
	github.com/duo-labs/webauthn.io v0.0.0-20200929144140-c031a3e0f95d
	github.com/kataras/go-events v0.0.3
	github.com/kataras/golog v0.1.7
	github.com/libp2p/go-libp2p-http v0.2.1
	github.com/libp2p/go-libp2p-pubsub v0.6.0
	github.com/matrix-org/dendrite v0.8.1
	github.com/matrix-org/gomatrixserverlib v0.0.0-20220408160933-cf558306b56f
	github.com/matrix-org/util v0.0.0-20200807132607-55161520e1d4
	github.com/prometheus/client_golang v1.12.1
	github.com/sirupsen/logrus v1.8.1
	github.com/sonr-io/sonr v0.1.3
	github.com/spf13/cobra v1.4.0 // indirect
)
