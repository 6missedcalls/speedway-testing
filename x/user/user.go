package user

import (
	"fmt"

	"github.com/cosmos/btcutil/base58"
	"github.com/duo-labs/webauthn/webauthn"

	"github.com/sonr-io/sonr/pkg/did"
	"github.com/sonr-io/sonr/pkg/did/ssi"
)

type User struct {
	Username string `json:"username"`
	Document did.Document
	Os       string `json:"os"`
	Label    string `json:"label"`
}

func NewUser(address string, rawCred *webauthn.Credential, os string, label string) (*User, error) {
	doc, err := did.NewDocument(fmt.Sprintf("did:snr:%s", address))
	if err != nil {
		return nil, err
	}

	baseDid, err := did.ParseDID(fmt.Sprintf("did:snr:%s", address))
	if err != nil {
		return nil, err
	}

	keyDid, err := did.ParseDID(fmt.Sprintf("did:snr:%s#%s-%s", address, os, label))
	if err != nil {
		return nil, err
	}

	cred := did.WebauthnToCredential(rawCred)
	vm := did.VerificationMethod{
		ID:              *keyDid,
		Credential:      &cred,
		Type:            ssi.JsonWebKey2020,
		Controller:      *baseDid,
		PublicKeyBase58: base58.Encode(cred.PublicKey),
	}
	doc.AddAssertionMethod(&vm)
	return &User{
		Document: doc,
		Username: address,
	}, nil
}

func (u *User) AddCredential(rawCred *webauthn.Credential, os string, label string) error {
	baseDid, err := did.ParseDID(fmt.Sprintf("did:snr:%s", u.Username))
	if err != nil {
		return err
	}

	keyDid, err := did.ParseDID(fmt.Sprintf("did:snr:%s#%s-%s", u.Username, os, label))
	if err != nil {
		return err
	}

	cred := did.WebauthnToCredential(rawCred)
	vm := did.VerificationMethod{
		ID:              *keyDid,
		Credential:      &cred,
		Type:            ssi.JsonWebKey2020,
		Controller:      *baseDid,
		PublicKeyBase58: base58.Encode(cred.PublicKey),
	}
	u.Document.AddAssertionMethod(&vm)
	return nil
}

func (u *User) WebAuthnCredentialExcludeList() []string {
	return []string{}
}

func (user *User) WebAuthnID() []byte {
	return []byte(user.Document.GetID().ID)
}

func (user *User) WebAuthnName() string {
	return user.Username
}

func (user *User) WebAuthnDisplayName() string {
	return user.Username
}

func (user *User) WebAuthnIcon() string {
	return "https://pics.com/avatar.png"
}

func (u *User) WebAuthnCredentials() []webauthn.Credential {
	vms := u.Document.GetAssertionMethods()
	var creds []webauthn.Credential
	for _, vm := range vms {
		creds = append(creds, *CredentialToWebauthn(vm.Credential))
	}
	return creds
}

// WebauthnAuthenticatorToAuthenticator will convert a webauthn authenticator to a did authenticator
func LocalToWebauthnAuthenticator(a did.Authenticator) webauthn.Authenticator {
	return webauthn.Authenticator{
		AAGUID:       a.AAGUID,
		SignCount:    a.SignCount,
		CloneWarning: a.CloneWarning,
	}
}

// Convert Credential from Webauthn Type
func CredentialToWebauthn(c *did.Credential) *webauthn.Credential {
	var cred *webauthn.Credential
	if c.ID != nil {
		cred.ID = c.ID
	}

	if c.PublicKey != nil {
		cred.PublicKey = c.PublicKey
	}

	if c.AttestationType != "" {
		cred.AttestationType = c.AttestationType
	}
	cred.Authenticator = LocalToWebauthnAuthenticator(c.Authenticator)
	return cred
}
