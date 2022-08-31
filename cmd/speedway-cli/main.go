package main

import (
	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd"
	"github.com/spf13/cobra"
)

func main() {
	logger := golog.New()
	go cobra.CheckErr(speedwaycmd.Execute(logger))
}
