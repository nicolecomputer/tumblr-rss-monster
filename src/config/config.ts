function storageRoot() {
  if (process.env.STORAGE_ROOT) {
    return process.env.STORAGE_ROOT
  } else if (process.env.NODE_ENV === "development") {
    return "./data"
  }

  return "/data"
}

export default {
  storage_root: storageRoot(),
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
}
