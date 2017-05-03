const assert = require('assert')

describe('bucket', () => {
  const bucket = require('../src/gcloud/bucket')
  const uuidregex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
  const urlRegex = /^https:\/\/storage.googleapis.com\/artifacts.uploader.com\/test-files\//

  describe('#generateToken()', () => {
    it('should give me a token', () => {
      const token = bucket.generateToken()
      assert.notEqual(token, null)
      assert.notEqual(token.match(uuidregex), null)
    })
  })

  describe('#uploadBase64()', () => {
    it('should require a file', () => {
      return bucket.uploadBase64(null, null)
        .catch((err) => assert.equal(err, "no_file"))
    })

    it('should require a token', () => {
      return bucket.uploadBase64(null, "data:image/jpeg;base64,test")
        .catch((err) => assert.equal(err, "unauthorized"))
    })

    it('should require a correctly generated token', () => {
      return bucket.uploadBase64("tota", "data:image/jpeg;base64,test")
        .catch((err) => assert.equal(err, "unauthorized"))
    })


    it('should require a valid file', () => {
      return bucket.uploadBase64(bucket.generateToken(), "test")
        .catch((err) => assert.equal(err, "invalid_file"))
    })

    it('should return the url, type and extension of the upload', () => {
      return bucket.uploadBase64(
        bucket.generateToken(),
        "data:image/jpeg;base64,test"
      ).then((data) => {
        assert.notEqual(data.url.match(urlRegex), null)
        assert.notEqual(data.url.match(/\.jpeg$/), null)
        assert.equal(data.filetype, "image")
        assert.equal(data.extension, "jpeg")
      })
    })
  })

  describe('#uploadBuffer()', () => {
    it('should require a file', () => {
      return bucket.uploadBuffer(null, null)
        .catch((err) => assert.equal(err, "no_file"))
    })

    it('should require a valid file', () => {
      return bucket.uploadBuffer(bucket.generateToken(), {buffer: "invalid"})
        .catch((err) => assert.equal(err, "invalid_file"))
    })

    it('should require a token', () => {
      return bucket.uploadBuffer(
        null,
        {mimetype: "text/csv", buffer: new Buffer("test")}
      ).catch((err) => assert.equal(err, "unauthorized"))
    })

    it('should require a correctly generated token', () => {
      bucket.uploadBuffer(
        "tota",
        {mimetype: "text/csv", buffer: new Buffer("test")}
      ).catch((err) => assert.equal(err, "unauthorized"))
    })

    it('should return the url, type and extension of the upload', () => {
      return bucket.uploadBuffer(
        bucket.generateToken(),
        {mimetype: "text/csv", buffer: new Buffer("test")}
      ).then((data) => {
        assert.notEqual(data.url.match(urlRegex), null)
        assert.notEqual(data.url.match(/\.csv$/), null)
        assert.equal(data.filetype, "text")
        assert.equal(data.extension, "csv")
      })
    })
  })
})
