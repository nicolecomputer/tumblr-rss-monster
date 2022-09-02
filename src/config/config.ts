function storageRoot() {
  if (process.env.STORAGE_ROOT) {
    return process.env.STORAGE_ROOT
  } else if (process.env.NODE_ENV === "development") {
    return "./data"
  }

  return "/data"
}

function callbackURLBase() {
  if (process.env.CALLBACK_URL_BASE) {
    return process.env.CALLBACK_URL_BASE
  } else if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:6969/"
  }

  return "http://127.0.0.1:6969/"
}

export default {
  storage_root: storageRoot(),
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
  callbackURLBase: callbackURLBase()
}
