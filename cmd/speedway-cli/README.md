# Speedway CLI (WIP)

## Registry
*If Built/Installed*

Create an account with the `create` command.

```bash
speedway registry create
```

Login to an existing account with the `login` command.

```bash
speedway registry login
```

*If Not Built/Installed*

Create an account with the `create` command.

```bash
go run main.go registry create
```

Login to an existing account with the `login` command.

```bash
go run main.go registry login
```

## Schema

*If Built/Installed*

Create a schema with the `create` command.
```bash
speedway schema create
```

Query a schema with the `query` command.

```bash
speedway schema query
```

*If Not Built/Installed*

Create a schema with the `create` command.
```bash
go run main.go schema create
```

Query a schema with the `query` command.
```
go run main.go schema query
```

## Object

*If Built/Installed*

Build an object with the `build` command.
```bash
speedway object build
```

Get an object with the `get` command.

```bash
speedway object get
```

*If Not Built/Installed*

Build an object with the `build` command.
```bash
go run main.go object build
```

Get an object with the `get` command.
```
go run main.go object get
```

