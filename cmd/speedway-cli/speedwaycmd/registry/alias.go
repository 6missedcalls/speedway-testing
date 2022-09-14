package registry

import (
	"context"
	"errors"
	"regexp"
	"strconv"

	"github.com/kataras/golog"
	"github.com/manifoldco/promptui"
	rt "github.com/sonr-io/sonr/x/registry/types"
	"github.com/sonr-io/speedway/internal/binding"
	"github.com/sonr-io/speedway/internal/prompts"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/sonr-io/speedway/internal/utils"
	"github.com/spf13/cobra"
)

// Validate an Alias
func validateAlias(input string) error {
	if len(input) < 3 {
		return errors.New("alias is too short")
	}
	if len(input) > 12 {
		return errors.New("alias is too long")
	}
	var validAlias = regexp.MustCompile(`^[a-zA-Z0-9]+$`).MatchString
	if !validAlias(input) {
		return errors.New("alias is invalid")
	}
	return nil
}

// Method to buy an Alias
// Command Example: speedway account buy-alias
func bootstrapBuyAlias(ctx context.Context, logger *golog.Logger) (buyAliasCmd *cobra.Command) {
	buyAliasCmd = &cobra.Command{
		Use:   "buy-alias",
		Short: "Buy an alias on the Sonr Network.",
		Long:  "Buys an alias on the Sonr Network.",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf("Login Error: ", err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatal(status.Error("Login Failed"))
				return
			}

			var name string = ""
			msg := rt.MsgBuyAlias{}
			if name, err = cmd.Flags().GetString("alias"); err == nil && name == "" {
				aliasPrompt := promptui.Prompt{
					Label:    "Enter the Alias name",
					Validate: validateAlias,
				}
				name, err = aliasPrompt.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			if err = validateAlias(name); err != nil {
				logger.Info("Command failed %v\n", err)
				return
			}

			msg = rt.MsgBuyAlias{
				Creator: loginRequest.Did,
				Name:    name,
			}

			logger.Info(status.Info, "Purchasing Alias")

			buyAliasMsg, err := m.BuyAlias(msg)
			if err != nil {
				logger.Fatalf("Error: ", err)
				return
			}

			if buyAliasMsg.Success {
				logger.Info(status.Success("Alias Purchased"))
			} else {
				logger.Fatal(status.Error("Alias Purchase Failed"))
				return
			}
		},
	}
	buyAliasCmd.PersistentFlags().String("alias", "", "The alias to buy")
	return
}

// Method to sell an Alias
// Command Example: speedway account sell-alias
func bootstrapSellAlias(ctx context.Context, logger *golog.Logger) (sellAliasCmd *cobra.Command) {
	sellAliasCmd = &cobra.Command{
		Use:   "sell-alias",
		Short: "Sell an alias on the Sonr Network.",
		Long:  "Sell an alias on the Sonr Network.",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf("Login Error: ", err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatal(status.Error("Login Failed"))
				return
			}

			var name string = ""
			msg := rt.MsgSellAlias{}
			if name, err = cmd.Flags().GetString("alias"); err == nil && name == "" {
				aliasName := promptui.Prompt{
					Label:    "Enter the Alias name",
					Validate: validateAlias,
				}
				name, err = aliasName.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			// If price flag is not set, prompt for price
			// prompt needs to be int32
			// price needs to be greater than 0
			var price int = 0
			if price, err = cmd.Flags().GetInt("price"); err == nil && price <= 0 {
				pricePrompt := promptui.Prompt{
					Label: "Enter the price",
				}
				priceStr, err := pricePrompt.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
				price, err = strconv.Atoi(priceStr)
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}

				if price <= 0 {
					logger.Info("Price must be greater than 0")
					return
				}
			}

			if err = validateAlias(name); err != nil {
				logger.Info("Command failed %v\n", err)
				return
			}

			msg = rt.MsgSellAlias{
				Creator: loginRequest.Did,
				Alias:   name,
				Amount:  int32(price),
			}

			logger.Info(status.Info, "Attempting to put Alias up for sale")

			sellAliasMsg, err := m.SellAlias(msg)
			if err != nil {
				logger.Fatalf("Error: ", err)
				return
			}
			if sellAliasMsg.Success {
				logger.Info(status.Success("Alias Listed for Sale"))
			} else {
				logger.Fatal(status.Error("Alias Sale Listing Failed"))
				return
			}
		},
	}
	sellAliasCmd.PersistentFlags().String("alias", "", "The alias to sell")
	sellAliasCmd.PersistentFlags().Int("price", 0, "The price to list the alias for sale")
	return
}

// Method to buy an Alias
// Command Example: speedway account transfer-alias
func bootstrapTransferAlias(ctx context.Context, logger *golog.Logger) (transferAliasCmd *cobra.Command) {
	transferAliasCmd = &cobra.Command{
		Use:   "transfer-alias",
		Short: "Transfer an alias on the Sonr Network.",
		Long:  "Transfer an alias on the Sonr Network.",
		Run: func(cmd *cobra.Command, args []string) {
			loginRequest := prompts.LoginPrompt()

			m := binding.InitMotor()

			loginResult, err := utils.Login(m, loginRequest)
			if err != nil {
				logger.Fatalf("Login Error: ", err)
				return
			}
			if loginResult.Success {
				logger.Info(status.Success("Login Successful"))
			} else {
				logger.Fatal(status.Error("Login Failed"))
				return
			}

			var name string = ""
			msg := rt.MsgTransferAlias{}
			if name, err = cmd.Flags().GetString("alias"); err == nil && name == "" {
				aliasName := promptui.Prompt{
					Label:    "Enter the Alias name",
					Validate: validateAlias,
				}
				name, err = aliasName.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			var recipient string = ""
			if recipient, err = cmd.Flags().GetString("recipient"); err == nil && recipient == "" {
				recipientPrompt := promptui.Prompt{
					Label: "Enter the recipient DID",
				}
				recipient, err = recipientPrompt.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			var amount int = 0
			if amount, err = cmd.Flags().GetInt("amount"); err == nil && amount == 0 {
				amountPrompt := promptui.Prompt{
					Label: "Enter the price",
				}
				amountStr, err := amountPrompt.Run()
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
				amount, err = strconv.Atoi(amountStr)
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			if err = validateAlias(name); err != nil {
				logger.Info("Command failed %v\n", err)
				return
			}

			msg = rt.MsgTransferAlias{
				Creator:   loginRequest.Did,
				Alias:     name,
				Recipient: recipient,
				Amount:    int32(amount),
			}

			logger.Info(status.Info, "Transferring Alias")

			transferAliasMsg, err := m.TransferAlias(msg)
			if err != nil {
				logger.Fatalf("Error: ", err)
				return
			}
			if transferAliasMsg.Success {
				logger.Info(status.Success("Alias Transferred"))
			} else {
				logger.Fatal(status.Error("Alias Transfer Failed"))
				return
			}
		},
	}
	transferAliasCmd.PersistentFlags().String("alias", "", "The alias to transfer")
	transferAliasCmd.PersistentFlags().String("recipient", "", "The recipient of the transfer")
	transferAliasCmd.PersistentFlags().Int("amount", 0, "The amount of the alias to be transferred")
	return
}
