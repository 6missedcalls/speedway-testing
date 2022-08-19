package status

import (
	"github.com/ttacon/chalk"
)

func SuccessStyle() chalk.Style {
	Success := chalk.Green.NewStyle().WithTextStyle(chalk.Bold)
	return Success
}

func WarningStyle() chalk.Style {
	Warning := chalk.Yellow.NewStyle().WithTextStyle(chalk.Bold)
	return Warning
}

func ErrorStyle() chalk.Style {
	Error := chalk.Red.NewStyle().WithTextStyle(chalk.Bold)
	return Error
}

func InfoStyle() chalk.Color {
	return chalk.Blue
}

func DebugStyle() chalk.Color {
	return chalk.White
}

var Success = SuccessStyle()
var Warning = WarningStyle()
var Error = ErrorStyle()
var Info = InfoStyle()
var Debug = DebugStyle()
