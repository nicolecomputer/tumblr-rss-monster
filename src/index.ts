import * as dotenv from 'dotenv'
dotenv.config()

import express from "express"
import session from "express-session"
import OAuth1Strategy from "passport-oauth1"
import passport from "passport"
import FileStoreInitializer from 'session-file-store'
import cookieParser from 'cookie-parser'
import tumblr from "tumblr.js"

import config from "./config/tumblr"
import tumblrDashboard from "./routes/tumblr-dashboard";
import tumblrLikes from "./routes/tumblr-likes";
import tumblrUser from "./routes/tumblr-user"

// Extract to env variable
const STORAGE_ROOT = "./data/"

const FileStore = FileStoreInitializer(session);
passport.use(new OAuth1Strategy({
    requestTokenURL: 'https://www.tumblr.com/oauth/request_token',
    accessTokenURL: 'https://www.tumblr.com/oauth/access_token',
    userAuthorizationURL: 'https://www.tumblr.com/oauth/authorize',
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: "http://127.0.0.1:6969/auth/tumblr/callback",
    signatureMethod: "HMAC-SHA1"
}, async (token, tokenSecret, profile, cb) => {
    console.log("Profile", profile)
    console.log("Token", token)

    const tumblrClient = tumblr.createClient({
        credentials: {
            consumer_key: config.consumer_key,
            consumer_secret: config.consumer_secret,
            token: token,
            token_secret: tokenSecret,
        },
        returnPromises: true
    });

    // TODO: Find or create user

    try {
        // @ts-ignore: Promises are promised
        const userInfo = await tumblrClient.userInfo();
        // @ts-ignore: And this will work
        const username = userInfo.user.name

        const user = {
            username: username,
            token: token,
            secret: tokenSecret
        }
        return cb(null, user);
    } catch (error) {
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
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('trust proxy', 1)
app.use(cookieParser());
app.set('port', 6969)
app.use(session({
    store: new FileStore({
        path: `${STORAGE_ROOT}/sessions`
    }),
    secret: 'tumblr-secure-secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


app.get('/', function (req, res) {
    console.log(req.user)
    res.render('pages/index', {
        tumblrAuthUrl: ""
    });
});

// RSS Routes
app.get('/tumblr-dashboard.rss', tumblrDashboard);
app.get('/tumblr-likes.rss', tumblrLikes)
app.get('/tumblr-user/:userid/feed.rss', tumblrUser)

// Per-user routes
app.get('/user/:userid/', function (req, res) {
    // Look up :userid in database
    // If not found redirect to homepage
    console.log(req.user)
    res.render('pages/user-dashboard', {
        user: {
            id: '5ce50bad-dad1-4830-8984-6f2c7cb0f571',
            name: 'foxfire'
        }
    });
});
app.get('/user/:userid/rss/dashboard.rss', tumblrUser)
app.get('/user/:userid/rss/likes.rss', tumblrUser)
app.get('/tumblr-user/:userid/blog/:blogid/feed.rss', tumblrUser)

// Auth
app.get('/auth/tumblr',
    passport.authenticate('oauth'));

app.get('/auth/tumblr/callback',
    passport.authenticate('oauth', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });



const localURL = `http://localhost:${app.get('port')}`

console.log('============')
console.log('AVAILABLE PATHS')

app._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        const route = r.route.path;
        console.log(`${localURL}${route}`)
    }
});

console.log('============')

app.listen(6969)
