package registry

import (
	"context"
	"errors"
	"regexp"
	"strconv"

	"github.com/Songmu/prompter"
	"github.com/kataras/golog"
	rt "github.com/sonr-io/sonr/x/registry/types"
	"github.com/sonr-io/speedway/internal/client"
	"github.com/sonr-io/speedway/internal/status"
	"github.com/spf13/cobra"
)

// Validate Alias and return bool if valid or err if invalid
func validateAlias(alias string) (bool, error) {
	if len(alias) < 3 {
		return false, errors.New("alias is too short")
	}
	if len(alias) > 32 {
		return false, errors.New("alias is too long")
	}
	var validAlias = regexp.MustCompile(`^[a-zA-Z0-9]+$`).MatchString
	if !validAlias(alias) {
		return false, errors.New("alias is invalid")
	}
	return true, nil

}

// Method to buy an Alias
// Command Example: speedway account buy-alias
func bootstrapBuyAlias(ctx context.Context, logger *golog.Logger) (buyAliasCmd *cobra.Command) {
	buyAliasCmd = &cobra.Command{
		Use:   "buy-alias",
		Short: "Buy an alias on the Sonr Network.",
		Long:  "Buys an alias on the Sonr Network.",
		Run: func(cmd *cobra.Command, args []string) {
			var (
				name string
				err  error
			)

			if name, err = cmd.Flags().GetString("alias"); err == nil && name == "" {
				name = (&prompter.Prompter{
					Message: "Enter Alias",
					Regexp:  regexp.MustCompile(`.{3,}`),
				}).Prompt()
			}
			if name == "" {
				logger.Fatal(status.Error("Alias is required"))
				return
			}

			if valid, err := validateAlias(name); !valid {
				logger.Fatal(status.Error(err.Error()))
				return
			}

			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			session, err := cli.GetSessionInfo()
			if err != nil {
				logger.Fatalf(status.Error("SessionInfo Error: "), err)
				return
			}

			logger.Info(status.Info, "Purchasing Alias")

			buyAliasMsg, err := cli.BuyAlias(rt.MsgBuyAlias{
				Creator: session.Info.Address,
				Name:    name,
			})
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
			var (
				name string
				err  error
			)
			if name, err = cmd.Flags().GetString("alias"); err == nil && name == "" {
				name = (&prompter.Prompter{
					Message: "Enter Alias",
					Regexp:  regexp.MustCompile(`.{3,}`),
				}).Prompt()
			}

			// If price flag is not set, prompt for price
			// prompt needs to be int32
			// price needs to be greater than 0
			var price int
			if price, err = cmd.Flags().GetInt("price"); err == nil && price <= 0 {
				priceStr := (&prompter.Prompter{
					Message: "Enter Price",
				}).Prompt()
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

			if valid, err := validateAlias(name); !valid {
				logger.Fatal(status.Error(err.Error()))
				return
			}

			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			session, err := cli.GetSessionInfo()
			if err != nil {
				logger.Fatalf(status.Error("SessionInfo Error: "), err)
				return
			}

			logger.Info(status.Info, "Attempting to put Alias up for sale")

			sellAliasMsg, err := cli.SellAlias(rt.MsgSellAlias{
				Creator: session.Info.Address,
				Alias:   name,
				Amount:  int32(price),
			})
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
			var (
				name string
				err  error
			)
			if name, err = cmd.Flags().GetString("alias"); err == nil && name == "" {
				name = (&prompter.Prompter{
					Message: "Enter Alias",
					Regexp:  regexp.MustCompile(`.{3,}`),
				}).Prompt()
			}

			var recipient string
			if recipient, err = cmd.Flags().GetString("recipient"); err == nil && recipient == "" {
				recipient = (&prompter.Prompter{
					Message: "Enter Recipient",
				}).Prompt()
			}

			var amount int
			if amount, err = cmd.Flags().GetInt("amount"); err == nil && amount == 0 {
				amountStr := (&prompter.Prompter{
					Message: "Enter Amount",
				}).Prompt()
				amount, err = strconv.Atoi(amountStr)
				if err != nil {
					logger.Info("Command failed %v\n", err)
					return
				}
			}

			if valid, err := validateAlias(name); !valid {
				logger.Fatal(status.Error(err.Error()))
				return
			}

			cli, err := client.New(ctx)
			if err != nil {
				logger.Fatalf(status.Error("RPC Client Error: "), err)
				return
			}

			session, err := cli.GetSessionInfo()
			if err != nil {
				logger.Fatalf(status.Error("SessionInfo Error: "), err)
				return
			}

			logger.Info(status.Info, "Transferring Alias")

			transferAliasMsg, err := cli.TransferAlias(rt.MsgTransferAlias{
				Creator:   session.Info.Address,
				Alias:     name,
				Recipient: recipient,
				Amount:    int32(amount),
			})
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
