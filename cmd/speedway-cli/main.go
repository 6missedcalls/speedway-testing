package main

import (
	"github.com/kataras/golog"
	"github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd"
	"github.com/spf13/cobra"
)

var (
	logger = golog.Default.Child("speedway-cli")
)

func main() {
	logger.Info("Starting speedway-cli")
	cobra.CheckErr(speedwaycmd.Execute())
}
