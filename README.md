# Triratna Directory

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

By default, running the frontend locally will connect to the live backend, and this is sufficient for most development. Working within the backend requires AWS access. Reach out if you want to do something within the backend.

To run the lambdas locally:

1. Run `aws login` (see the Scripts Setup instructions below)
2. Run `npm run api`. This starts a local API at http://localhost:3001 which runs the lambdas in `src/lambdas` using the environment variables of the deployed functions. Changes to a lambda take effect on the next request, without needing a restart.
3. Add `API_URL=http://localhost:3001` to `.env` and restart `npm start`

Requests for routes that don't have a lambda in this repo are passed through to the live API. The scheduled refresh can be triggered by hand with `curl -X POST http://localhost:3001/refresh-data`.

Note that the local lambdas use the real production data and services, so for example updating contact details or sending feedback locally really does it. Any environment variable set when starting the API overrides the deployed one, e.g. `DATA_S3_BUCKET=my-test-bucket npm run api`. Logging in and out can't be tested locally because the SSO provider always returns to the live API.

## Scripts

### Setup

1. If you haven't already, install npm and run `npm install` as instructed above in the Local Development Setup instructions
2. If you haven't already, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. Run `aws login` and login. If prompted, specify the region as `eu-west-2`.

### Upload Photos

To upload photos, you will need a directory on your machine containing all the Order photos, with each file being the name of an Order member with ".jpg" extension (for example "Dhammakumara.jpg"). You must keep all the entire directory of photos together - the script will automatically only upload the ones that have changed and delete any that have been removed.

Then simply run this command, with the last argument being the path to that directory:

```
npm run upload-photos /path/to/photos
```

The app refreshes data every 5 minutes so it will take up to that long for the new photos to show. You can force a refresh by clearing your browser's local storage.
