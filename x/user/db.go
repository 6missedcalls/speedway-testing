package user

import (
	"fmt"
	"log"
	"sync"

	"github.com/duo-labs/webauthn.io/session"
	"github.com/duo-labs/webauthn/protocol"
	"github.com/duo-labs/webauthn/webauthn"
	"github.com/sonr-io/sonr/pkg/did"
)

type userdb struct {
	users map[string]*User
	mu    sync.RWMutex
}

var DB *userdb
var WebAuthn *webauthn.WebAuthn
var SessionStore *session.Store

func init() {
	var err error
	if WebAuthn == nil {
		WebAuthn, err = webauthn.New(&webauthn.Config{
			RPDisplayName:         "Sonr - Highway",         // Display Name for your site
			RPID:                  "highway.sh",             // Generally the domain name for your site
			RPOrigin:              "https://www.highway.sh", // The origin URL for WebAuthn requests
			AttestationPreference: protocol.PreferDirectAttestation,
		})

		if err != nil {
			log.Println(err)
		}
	}

	if DB == nil {
		DB = NewDB()
	}

	if SessionStore == nil {
		SessionStore, err = session.NewStore()
		if err != nil {
			log.Println(err)
		}
	}
}

// DB returns a userdb singleton
func NewDB() *userdb {
	if DB == nil {
		DB = &userdb{
			users: make(map[string]*User),
		}
	}
	return DB
}

func InitUser(name string) (*User, error) {
	doc, err := did.NewDocument(fmt.Sprintf("did:snr:%s", name))
	if err != nil {
		return nil, err
	}
	usr := &User{
		Document: doc,
		Username: name,
	}
	DB.PutUser(usr)
	return usr, nil
}

// GetUser returns a *User by the user's username
func (db *userdb) GetUser(name string) (*User, error) {
	db.mu.Lock()
	defer db.mu.Unlock()
	user, ok := db.users[name]
	if !ok {
		return nil, fmt.Errorf("error getting user '%s': does not exist", name)
	}

	return user, nil
}

// PutUser stores a new user by the user's username
func (db *userdb) PutUser(user *User) {
	db.mu.Lock()
	defer db.mu.Unlock()
	db.users[user.Username] = user
}
