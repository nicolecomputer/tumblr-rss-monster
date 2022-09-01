# Tumblr Dashboard RSS

This project consumes tumblr posts and spits out nicely formatted RSS feeds.

It uses Tumblr's authentication methods which means you should be able to see prviate and NSFW blogs in your RSS reader.

## Deploying

This project is meant to be deployed as a docker container.

### Environemnt variables:

- `TUMBLR_CONSUMER_KEY`: Tumblr consumer key from [creating an application](https://www.tumblr.com/oauth/apps)
- `TUMBLR_CONSUMER_SECRET`: Tumblr consumer key from [creating an application](https://www.tumblr.com/oauth/apps)
- `STORAGE_ROOT`: Optional defaults to /data/

### Mounts:

You'll want to mount a folder that will persist between deploys.

- `/data`: location for database, cache, and cookie storage

### Ports

This project exepcts the container's port of `6969` to be forwarded to your destination port.

## Development

Tumblr-Dashboard-RSS is written in Typescript. To get started you need to:

- Clone the project
- Install the dependencies (`yarn install`)
- Create a [.env](https://www.npmjs.com/package/dotenv) file in the project root with the name environment variables docker expects
- Set `TUMBLR_CONSUMER_KEY`, `TUMBLR_CONSUMER_SECRET` in the .env file
- Start the project (`yarn start`)

This will start a process that will watch the source code (located in `src/`) for changes, compile those changes from typescript to javascript, output the javascript to `dist/` and run the program.

## Credits

This was originally based on a project started [Meyer](https://github.com/meyer) and then modified by [NicoleComputer](https://github.com/meyer).
