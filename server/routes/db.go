package nebula

import (
	"fmt"
	"log"
	"sync"

	"github.com/duo-labs/webauthn.io/session"
	"github.com/sonr-io/sonr/pkg/did"
)

type userdb struct {
	users        map[string]*User
	mu           sync.RWMutex
	sessionStore *session.Store
}

// DB returns a userdb singleton
func NewDB() *userdb {

	sessionStore, err := session.NewStore()
	if err != nil {
		log.Println(err)
	}
	return &userdb{
		users:        make(map[string]*User),
		sessionStore: sessionStore,
		mu:           sync.RWMutex{},
	}
}

func (db *userdb) InitUser(name string) (*User, error) {
	usr := &User{
		VerificationMethods: make([]did.VerificationMethod, 0),
		Username:            name,
	}

	db.PutUser(usr)
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
