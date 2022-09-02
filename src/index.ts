// Dotenv is special, it needs to be initialize as SOON AS POSSIBLE
import * as dotenv from 'dotenv'
dotenv.config()

// System Library
import Crypto from "crypto";

// Third party libraries
import express from "express"
import session from "express-session"
import OAuth1Strategy from "passport-oauth1"
import passport from "passport"
import FileStoreInitializer from 'session-file-store'
import cookieParser from 'cookie-parser'
import tumblr from "tumblr.js"
import expressLayouts from "express-ejs-layouts"

// Local dependencies
import AppConfig from "./config/config"
import tumblrDashboard from "./routes/tumblr-dashboard";
import tumblrLikes from "./routes/tumblr-likes";
import tumblrUser from "./routes/tumblr-user"
import userStore from "./data_storage/user"

function initialize() {
    const requiredVars = {
        "TUMBLR_CONSUMER_KEY": "Tumblr API Key (register at https://www.tumblr.com/oauth/apps)",
        "TUMBLR_CONSUMER_SECRET": "Tumblr API Key (register at https://www.tumblr.com/oauth/apps)"
    }

    Object.keys(requiredVars).forEach((requiredVar: string) => {
        if (!process.env[requiredVar]) {
            console.error(`Missing environment variable: ${requiredVar}: ${requiredVars[requiredVar]}`)
            if (process.env.NODE_ENV === "development") {
                console.error(`\nMake sure you set ${requiredVar} in the .env file OR`)
                console.error(`\nMake sure you set ${requiredVar} in the Codespace settings`)
            } else {
                console.error(`\tThis should be passed as a variable to the docker container`)
            }
            process.exit(1)
        }
    })
}

async function main() {
    // Sanity check the environment
    initialize()

    // Setup database
    await userStore.createTable();

    const FileStore = FileStoreInitializer(session);
    passport.use(new OAuth1Strategy({
        requestTokenURL: 'https://www.tumblr.com/oauth/request_token',
        accessTokenURL: 'https://www.tumblr.com/oauth/access_token',
        userAuthorizationURL: 'https://www.tumblr.com/oauth/authorize',
        consumerKey: AppConfig.consumer_key,
        consumerSecret: AppConfig.consumer_secret,
        callbackURL: "http://127.0.0.1:6969/auth/tumblr/callback",
        signatureMethod: "HMAC-SHA1"
    }, async (token, tokenSecret, profile, cb) => {
        const tumblrClient = tumblr.createClient({
            credentials: {
                consumer_key: AppConfig.consumer_key,
                consumer_secret: AppConfig.consumer_secret,
                token: token,
                token_secret: tokenSecret,
            },
            returnPromises: true
        });

        try {
            // @ts-ignore: Promises are promised
            const userInfo = await tumblrClient.userInfo();
            // @ts-ignore: And this will work
            const username = userInfo.user.name

            const user = await userStore.findByUsername(username)
            if (!user) {
                const userId = Crypto.randomUUID();
                await userStore.insert(
                    userId,
                    username,
                    token,
                    tokenSecret)
                return cb(null, {
                    id: userId
                });
            } else {
                // TODO: Update the user record with the new keys
            }

            return cb(null, {});
        } catch (error) {
            console.log("ERROR", error)
            return cb(error, null)
        }
    }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    const app = express()
    app.use(expressLayouts);
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));

    app.set('views', __dirname + '/views');
    app.set('trust proxy', 1)
    app.use(cookieParser());
    app.set('port', 6969)
    app.use(session({
        store: new FileStore({
            path: `${AppConfig.storage_root}/sessions`
        }),
        secret: 'tumblr-secure-secret',
        resave: false,
        saveUninitialized: false
    }))

    app.use(passport.initialize())
    app.use(passport.session())


    app.get('/', async (req, res) => {
        const users = await userStore.all()
        res.render('pages/users', {
            users: users
        });
    });

    app.get('/settings', async (req, res) => {
        res.render('pages/settings', {
            appConfig: AppConfig
        });
    });


    const userRouteErrorHandler = (error, req, res, next) => {
        console.log(error)
        if (error.name === "UserNotFoundError") {
            res.status(404).send(error.message);
            return
        }

        res.status(500).send("Something went wrong");
        return
    }

    // RSS Routes
    app.get('/user/:userid/rss/dashboard.rss', tumblrDashboard, userRouteErrorHandler);
    app.get('/user/:userid/rss/likes.rss', tumblrLikes, userRouteErrorHandler)
    app.get('/blog/:blogId/feed.rss', tumblrUser, userRouteErrorHandler)

    // Auth
    app.get('/auth/tumblr',
        passport.authenticate('oauth'));

    app.get('/auth/tumblr/callback',
        passport.authenticate('oauth', { failureRedirect: '/login' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });



    const localURL = `http://127.0.0.1:${app.get('port')}`

    console.log('============')
    console.log('AVAILABLE PATHS')
    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            const route = r.route.path;
            console.log(`${localURL}${route}`)
        }
    });
    console.log('============')

    app.listen(6969);
}

main();
