package initmotor

import (
	"fmt"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/sonr-io/speedway/internal/hwid"
	"github.com/ttacon/chalk"
)

func InitMotor() mtr.MotorNode {
	fmt.Println(chalk.Yellow, "Initializing motor...")

	hwid, err := hwid.GetHwid()
	if err != nil {
		fmt.Println(chalk.Red, "Hwid Error: %s", err)
	}
	m := mtr.EmptyMotor(hwid)

	fmt.Println(chalk.Green, "Motor initialized", m)
	return m
}
