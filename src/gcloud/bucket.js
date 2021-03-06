const upload = require('./uploadStrategy')
const uuid = require('node-uuid')
const Cache = require('node-cache')

const base64Header = new RegExp("^data:(([^/]+)/([^;]+));base64,?")
const tokens = new Cache({stdTTL: 60 * 60 * 3})

module.exports.generateToken = () => {
  const token = uuid.v1()
  tokens.set(token, new Date())

  return token
}

const isValidToken = (token) => {
  return token && (tokens.del(token) > 0)
}

const generateFilename = (extension, orig) => {
  if(orig) return `${uuid.v1()}/${orig}`
  return `${uuid.v1()}.${extension}`
}

const doUploadBuffer = (buffer, matches, originalFilename) => {
  if(!matches) return Promise.reject("invalid_file")

  const [match, mimetype, filetype, extension] = matches
  const body = {
    key: generateFilename(extension, originalFilename),
    buffer: buffer
  }

  const url = `${upload.getBucketPath()}/${body.key}`
  const uploadStrategy = upload.getUploadStrategy()
  const result = {
    url: url,
    mimetype: mimetype,
    filetype: filetype,
    extension: extension
  }

  return new Promise((resolve, reject) => {
    uploadStrategy(resolve, reject, body)
  }).then(() => result)
}

module.exports.uploadBase64 = (token, file) => {
  if(!file) return Promise.reject("no_file")
  if(!isValidToken(token)) return Promise.reject("unauthorized")

  return doUploadBuffer(
    new Buffer(file.replace(base64Header, ""), "base64"),
    base64Header.exec(file)
  )
}
module.exports.uploadBuffer = (token, file) => {
  if(!file) return Promise.reject("no_file")
  if(!isValidToken(token)) return Promise.reject("unauthorized")
  if(!file.buffer || !Buffer.isBuffer(file.buffer) || !file.mimetype)
    return Promise.reject("invalid_file")

  return doUploadBuffer(
    file.buffer,
    new RegExp("^(([^/]+)/(.+))$").exec(file.mimetype),
    file.originalname
  )
}
