const config = {
  development: {
    env: "development",
    bucketPrefix: "https://storage.googleapis.com",
    bucket: "artifacts.uploader.com",
    path: "dev-files",
    resources: {
      projectId: "uploader",
      keyFilename: process.env.KEYFILE || `${process.cwd()}/keyfile.json`
    }
  },
  test: {
    env: "test",
    bucketPrefix: "https://storage.googleapis.com",
    bucket: "artifacts.uploader.com",
    path: "test-files",
    resources: {
      projectId: "uploader",
      keyFilename: process.env.KEYFILE || `${process.cwd()}/keyfile.json`
    }
  },
  production: {
    env: "production",
    bucketPrefix: "https://storage.googleapis.com",
    bucket: process.env.BUCKET,
    path: "prod-files",
    resources: {
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEYFILE
    }
  }
}

module.exports = config[process.env.NODE_ENV || "development"]
