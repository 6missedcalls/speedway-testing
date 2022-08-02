# Speedway Setup

## ENV
```
GIN_MODE: "debug"
RPDisplayName: "Speedway"
RPID: "localhost"
RPOrigin: "http://localhost:8080"
Address: "localhost:8080"
StaticDir: "./build"
```

## Setup
Build of speedway must be created and copied into 'server'

## Running Server
```
task webserver:run:debug
```
```
task webserver:run:prod
```

## Docker
```
Docker build -t speedway:latest .
```
```
Docker run -d -t speedway:latest
```