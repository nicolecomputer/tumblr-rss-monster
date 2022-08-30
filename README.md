# Tumblr Dashboard RSS

This project consumes tumblr posts and spits out nicely formatted RSS feeds.

It uses Tumblr's authentication methods which means you should be able to see prviate and NSFW blogs in your RSS reader.

## Deploying

This project is meant to be deployed as a docker container. It expects the following environemnt variables

- `TUMBLR_CONSUMER_KEY`
- `TUMBLR_CONSUMER_SECRET`
- `TUMBLR_TOKEN`
- `TUMBLR_TOKEN_SECRET`

You'll need to get the consumer key and secret by creating a [tumblr application](https://www.tumblr.com/oauth/apps). For the token and secret follow the steps below.

It exepcts the container's port of `6969` to be forwarded to your destination port.


## Getting Auth tokens

The easiest way to get required Tumblr auth tokens is to click “Explore API” on the [Tumblr app index page][tumblr-app-index] after you’ve generated a new application.

![Keys!](README-generate-keys.png)

That’ll take you to a developer console with your generated user tokens prefilled. Handy!

## Development

Tumblr-Dashboard-RSS is written in typescript. To get started you need to:
- Clone the project
- Install the dependencies (`yarn install` or `npm install`)
- Create a [.env](https://www.npmjs.com/package/dotenv) file in the project root with the name environment variables docker expects
- Start the project (`yarn start` or `npm start`)

This will start a process that will watch the source code (located in `src/`) for changes, compile those changes from typescript to javascript, output the javascript to `dist/` and run the main script.

## Credits

This was originally written by [Meyer](https://github.com/meyer) and then modified by [NicoleComputer](https://github.com/meyer).