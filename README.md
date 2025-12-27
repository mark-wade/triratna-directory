# triratna.directory

## Local Development

### Setup

If you haven't already, install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Then run:

```
npm install
```

### Run

To start, run:

```
npm start
```

The output will include a line that says something like `Server running at http://localhost:1234`. Open that URL in your browser to use.

You will immediately be redirected to the single sign-on provider which will then redirect you back to the production site. Copy the value of the `jwt` cookie that gets set and manually set that same cookie using your browser's tools on the localhost origin so that you can actually use it locally without continually being redirected to sign in. To stop the redirect happening so that you can set the cookie, you can navigate to http://localhost:1234/?loginError=err.

### Lambdas

By default, running the frontend locally will connect to the live backend, and this is sufficient for most development. Working within the backend requires obtaining a number of secrets depending on which part you are working with. Reach out if you want to do something within the backend.
