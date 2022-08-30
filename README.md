# Speedway

### Running the UI: dev mode
This mode is ideal for UI development. Changes to the code will reflect on the browser automatically and there is no need to build. Any data generated will be local only.

**run the UI:**
```
npm install
npm start
```

**on a second terminal, run the development server:**
```
cd server-in-memory
npm install
npm start
```

The UI should open automatically on your browser, but if that's not the case, it can be found under `localhost:3000`

**to reset the local data, go to:**
```
localhost:8080/reset
```

### Running the UI with real data
In this mode, actions on the UI will generate real on-chain data.
```
npm install
npm run build
```
Then go to the `server` folder and run either one of those:
`task webserver:run:prod`
`task webserver:run:debug`
