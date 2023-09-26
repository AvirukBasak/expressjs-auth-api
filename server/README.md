# ExpressJS Template Directory

## Getting started
Create a new project by cloning this repo.

- Set the `MONGODB_URI` in `.env.local`
- Add local enviroment variables to `.env.local`
- Add environment config to `loadEnv.mjs`
- Add routes to `routes/*.mjs`.
- Add API endpoints to `routes/api.mjs`
- Add server modules to `lib/*.js`
- Load your routes in `index.mjs`

## Setting MongoDB URI
Create a `.env.local` inside this `server` directory and give it an entry in followong format
```
MONGODB_URI='mongodb+srv://<username>:<passswd>@<some_domain>/?retryWrites=true&w=majority'
```
You will find the above URI in MongoDB Atlas (you'll need to hunt a little for it or create a new cluster if you don't have one).


Alternatively, for local MongoDB server instance
```
MONGODB_URI='mongodb://0.0.0.0:27017'
```

**Note**: Only use `0.0.0.0` for the IP address or MongoDB local server will refuse connections.

## Run server
```
npm install
npm start
```
