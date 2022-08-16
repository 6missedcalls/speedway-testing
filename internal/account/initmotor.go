package account

import (
	"fmt"

	mtr "github.com/sonr-io/sonr/pkg/motor"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
)

func InitMotor() mtr.MotorNode {
	fmt.Println(status.Debug, "Initializing motor...")

	hwid := utils.GetHwid()
	m := mtr.EmptyMotor(hwid)

	return m
}
