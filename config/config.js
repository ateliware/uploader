const config = {
  development: {
    env: "development",
    bucketPrefix: "https://storage.googleapis.com",
    bucket: "artifacts.uploader.com",
    path: "dev-files",
    resources: {
      projectId: "uploader",
      keyFilename: process.env.AW_KEYFILE || `${process.cwd()}/keyfile.json`
    }
  },
  test: {
    env: "test",
    bucketPrefix: "https://storage.googleapis.com",
    bucket: "artifacts.uploader.com",
    path: "test-files",
    resources: {
      projectId: "uploader",
      keyFilename: process.env.AW_KEYFILE || `${process.cwd()}/keyfile.json`
    }
  },
  production: {
    env: "production",
    bucketPrefix: "https://storage.googleapis.com",
    bucket: process.env.AW_BUCKET,
    path: "prod-files",
    resources: {
      projectId: process.env.AW_PROJECT_ID,
      keyFilename: process.env.AW_KEYFILE
    }
  }
}

module.exports = config[process.env.NODE_ENV || "development"]
