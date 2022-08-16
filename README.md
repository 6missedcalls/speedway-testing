# Speedway

## Up and running

### Create your .env file
First create the .env file in the root folder, for local development you can use this example:
```
REACT_APP_BASE_API="http://localhost:8080/api/v1"
```
### Run the development mock server
```
$ cd server-in-memory
$ npm install
$ npm run start
```
### Then in another terminal at the root folder run:
```
$ npm install
$ npm run start
```