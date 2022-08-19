package status

import (
	"github.com/ttacon/chalk"
)

var (
	Success = chalk.Green.NewStyle().WithTextStyle(chalk.Bold).Style
	Warning = chalk.Yellow.NewStyle().WithTextStyle(chalk.Underline).Style
	Error   = chalk.Red.NewStyle().WithTextStyle(chalk.Bold).Style
	Debug   = chalk.White
	Info    = chalk.Blue
	Reset   = chalk.Reset
)
