package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	t "github.com/sonr-io/sonr/types"
	rt "github.com/sonr-io/sonr/x/registry/types"
)

// @Summary Create WhoIs Entry
// @Schemes
// @Description This method takes a DIDDocument as an input along with the did of the account calling the TX, and verifies the signature. If succesful, and there is no existing WhoIs created for the user or application. Paramaters include: signature, diddocument, address, and whoIsType.
// @Tags Registry
// @Produce json
// @Param 		 data body rt.MsgCreateWhoIs true "Parameters"
// @Success 	 200  {object}  rt.MsgCreateWhoIsResponse
// @Failure      500  {string}  message
// @Router /v1/registry/create/whois [post]
func (s *HighwayServer) CreateWhoIs(c *gin.Context) {
	var req rt.MsgCreateWhoIs
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": t.ErrRequestBody.Error(),
		})
	}
	resp, err := s.Cosmos.BroadcastCreateWhoIs(&req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
	}
	// Return the response
	c.JSON(http.StatusOK, resp)
}

// @Summary Update WhoIs Entry
// @Schemes
// @Description This method takes an updated DIDDocument as a JSON buffer along with the signature of the current tx creator, and then verifies the account calling the TX is a controller of the On-chain DIDDocument. If so, the DIDDocument is updated on the blockchain and the transaction is broadcast.
// @Tags Registry
// @Produce json
// @Param 		 data body rt.MsgUpdateWhoIs true "Parameters"
// @Success 	 200  {object}  rt.MsgUpdateWhoIsResponse
// @Failure      500  {string}  message
// @Router /v1/registry/update/whois [post]
func (s *HighwayServer) UpdateWhoIs(c *gin.Context) {
	var req rt.MsgUpdateWhoIs
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	resp, err := s.Cosmos.BroadcastUpdateWhoIs(&req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
	}
	// Return the response
	c.JSON(http.StatusOK, resp)
}

// @Summary Deactivate WhoIs Entry
// @Schemes
// @Description This method sets the state of a particular WhoIs to be deactivated. In order to Succesfully perform this request, the TX creator and signature must be the same as the WhoIs owner.
// @Tags Registry
// @Produce json
// @Param 		 data body rt.MsgDeactivateWhoIs true "Parameters"
// @Success 	 200  {object}  rt.MsgDeactivateWhoIsResponse
// @Failure      500  {string}  message
// @Router /v1/registry/deactivate/whois [post]
func (s *HighwayServer) DeactivateWhoIs(c *gin.Context) {
	var req rt.MsgDeactivateWhoIs
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	resp, err := s.Cosmos.BroadcastDeactivateWhoIs(&req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
	}
	// Return the response
	c.JSON(http.StatusOK, resp)
}

// @Summary Buy an Alias for a User
// @Schemes
// @Description This method purchases a user alias .snr domain i.e. {example}.snr or application alias extension i.e. example.snr/{appName}, and inserts it into the 'alsoKnownAs' field of the app's DIDDocument. Request fails when the DIDDoc type doesnt match, wallet balance is too low, the alias has already been purchased, creator is not listed as controller of DIDDoc, or WhoIs is deactivated.
// @Tags Registry
// @Produce json
// @Param 		 data body rt.MsgBuyAlias true "Parameters"
// @Success 	 200  {object}  rt.MsgBuyAliasResponse
// @Failure      500  {string}  message
// @Router /v1/registry/buy/alias/name [post]
func (s *HighwayServer) BuyAlias(c *gin.Context) {
	var req rt.MsgBuyAlias
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	resp, err := s.Cosmos.BroadcastBuyNameAlias(&req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
	}
	// Return the response
	c.JSON(http.StatusOK, resp)
}

// @Summary Sell an Alias
// @Schemes
// @Description This method Sets a particular owned alias by a User or Application to `true` for the IsForSale property. It also takes the amount parameter in order to define how much the user owned alias is for sale.
// @Tags Registry
// @Produce json
// @Param 		 data body rt.MsgSellAlias true "Parameters"
// @Success 	 200  {object}  rt.MsgSellAliasResponse
// @Failure      500  {string}  message
// @Router /v1/registry/buy/alias/app [post]
func (s *HighwayServer) SellAlias(c *gin.Context) {
	var req rt.MsgBuyAlias
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	resp, err := s.Cosmos.BroadcastBuyAlias(&req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
	}
	// Return the response
	c.JSON(http.StatusOK, resp)
}

// @Summary Transfer an alias
// @Schemes
// @Description This method transfers an existing User .snr name or Application extension name Alias to the specified peer DIDDocument. The alias is removed from the current App or User's `alsoKnownAs` list and inserted into the new DIDDocument's `alsoKnownAs` list.
// @Tags Registry
// @Produce json
// @Param 		 data body rt.MsgTransferAlias true "Parameters"
// @Success      200  {object}  rt.MsgTransferAliasResponse
// @Failure      500  {string}  message
// @Router /v1/registry/transfer/alias/name [post]
func (s *HighwayServer) TransferAlias(c *gin.Context) {
	var req rt.MsgTransferAlias
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	resp, err := s.Cosmos.BroadcastTransferAlias(&req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
	}
	// Return the response
	c.JSON(http.StatusOK, resp)
}
