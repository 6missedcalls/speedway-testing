# Speedway CLI (WIP)

## Registry

_If Built/Installed_

Create an account with the `create` command.

```bash
speedway registry create
```

Login to an existing account with the `login` command.

```bash
speedway registry login
```

_If Not Built/Installed_

Create an account with the `create` command.

```bash
go run main.go registry create
```

Login to an existing account with the `login` command.

```bash
go run main.go registry login
```

## Schema

_If Built/Installed_

Create a schema with the `create` command.

```bash
speedway schema create
```

Query a schema with the `query` command.

```bash
speedway schema query
```

_If Not Built/Installed_

Create a schema with the `create` command.

```bash
go run main.go schema create
```

Query a schema with the `query` command.

```
go run main.go schema query
```

## Object

_If Built/Installed_

Build an object with the `build` command.
```bash
speedway object build
```

Get an object with the `get` command.

```bash
speedway object get
```

_If Not Built/Installed_

Build an object with the `build` command.
```bash
go run main.go object build
```

Get an object with the `get` command.
```
go run main.go object get
```


## Bucket

_If Built/Installed_
Create a bucket with the `create` command.
```bash
speedway bucket create
```

Get a bucket with the `get` command.
```bash
speedway bucket get all
```

_If Not Built/Installed_
Create a bucket with the `create` command.
```bash
go run main.go bucket create
```

Get a bucket with the `get` command.
```bash
go run main.go bucket get all
```
