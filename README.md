# Tumblr Dashboard RSS

This project consumes tumblr posts and spits out nicely formatted RSS feeds.

It uses Tumblr's authentication methods which means you should be able to see prviate and NSFW blogs in your RSS reader.

## Getting Auth tokens

The easiest way to get required Tumblr auth tokens is to click “Explore API” on the [Tumblr app index page][tumblr-app-index] after you’ve generated a new application.

![Keys!](README-generate-keys.png)

That’ll take you to a developer console with your generated user tokens prefilled. Handy!

Here are the environmental variables you’ll need to set:

```sh
TUMBLR_CONSUMER_KEY
TUMBLR_CONSUMER_SECRET
TUMBLR_TOKEN
TUMBLR_TOKEN_SECRET
```
---

## Credits

This was originally written by [Meyer][@meyer] and then modified by NicoleComputer.