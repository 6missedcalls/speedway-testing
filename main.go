/*
Copyright © 2022 Sonr <team@sonr.io>
*/
package main

import (
	"embed"

	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/cmd"
)

var (
	res embed.FS
)

func main() {
	logger := golog.New()
	cmd.Execute(logger, res)
}
