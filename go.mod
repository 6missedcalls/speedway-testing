module github.com/sonr-io/speedway

go 1.16

replace (
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1
	github.com/google/certificate-transparency-go => github.com/google/certificate-transparency-go v1.1.0
	github.com/ipfs/go-ipfs-blockstore => github.com/ipfs/go-ipfs-blockstore v1.1.2
	github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4
	google.golang.org/grpc => google.golang.org/grpc v1.29.1
)

require (
	github.com/kataras/golog v0.1.7
	github.com/sonr-io/sonr v0.3.0-beta.0.0.20220803162053-f1ae387f77ba
	github.com/spf13/cobra v1.5.0
	go.buf.build/grpc/go/sonr-io/motor v1.4.27
)
