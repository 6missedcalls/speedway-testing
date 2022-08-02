module github.com/sonr-io/nebula

go 1.16

replace (
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	github.com/google/certificate-transparency-go => github.com/google/certificate-transparency-go v1.1.0
	github.com/ipfs/go-ipfs-blockstore => github.com/ipfs/go-ipfs-blockstore v1.1.2
	github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4
	google.golang.org/grpc => google.golang.org/grpc v1.29.1
)

require (
	github.com/duo-labs/webauthn v0.0.0-20220330035159-03696f3d4499
	github.com/duo-labs/webauthn.io v0.0.0-20200929144140-c031a3e0f95d
	github.com/gin-gonic/contrib v0.0.0-20201101042839-6a891bf89f19
	github.com/gin-gonic/gin v1.7.7
	github.com/shengdoushi/base58 v1.0.0
	github.com/sonr-io/sonr v0.3.0-beta.0.0.20220711215224-abed535ab9da // TODO: revert this when beta/mpc gets merged into master
	go.buf.build/grpc/go/sonr-io/motor v1.4.22
	google.golang.org/grpc v1.46.2
)
