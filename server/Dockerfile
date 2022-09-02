FROM arm64v8/golang:1.18-alpine3.15 as base

WORKDIR /app

RUN apk update \
 && apk add --no-cache bash curl jq openssl \
 && rm -rf /var/cache/apk/*

COPY . .

ENV RPDisplayName = "Sonr - Speedway"
ENV RPID = "localhost"
ENV RPOrigin = "http://0.0.0.0:4040"
ENV Adress = "0.0.0.0:4040"
ENV StaticDir = "./build"
ENV SONR_RPC_ADDR_PUBLIC = "137.184.190.146:9090"

RUN export PATH=$(go env GOPATH)/bin:$PATH

RUN go mod tidy

CMD ["go", "run", "main.go"]
