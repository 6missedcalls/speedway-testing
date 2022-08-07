package main

import (
	"github.com/sonr-io/speedway/cmd/speedway-cli/speedwaycmd"
	"github.com/spf13/cobra"
)

func main() {
	cobra.CheckErr(speedwaycmd.Execute())
}
