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

By default, running the frontend locally will connect to the live backend, and this is sufficient for most development. Working within the backend requires obtaining a number of secrets depending on which part you are working with. Reach out if you want to do something within the backend.

## Scripts

### Setup

1. If you haven't already, install npm and run `npm install` as instructed above in the Local Development Setup instructions
2. If you haven't already, install the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
3. Run `aws login` and login. If prompted, specify the region as `eu-west-2`.

### Upload Photos

To upload photos, you will need a directory on your machine containing the photos you want to upload, with each file being the name of an Order member with ".jpg" extension (for example "Dhammakumara.jpg"). You can keep all the entire directory of photos together and the script will automatically only upload the ones that have changed.

Then simply run this command, with the last argument being the path to that directory:

```
npm run upload-photos /path/to/photos
```

The app refreshes data every 5 minutes so it will take up to that long for the new photos to show. You can force a refresh by clearing your browser's local storage.
