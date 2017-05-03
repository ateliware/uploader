const config = require('../../config/config.js')
const gcloud = require('google-cloud')(config.resources)

const gcs = gcloud.storage()

const options = {public: true}

const uploaderStrategyConcrete = (resolve, reject, body) => {
  const file = gcs.bucket(config.bucket).file(`${config.path}/${body.key}`)
  file.save(body.buffer, options, (err) => !!err ? reject(err) : resolve())
}

const uploaderStrategyFake = (resolve, _) => {
  if(config.env === 'development') console.log('FAKE UPLOADER')
  resolve()
}

const strategies = new Map()
strategies.set('development', uploaderStrategyFake)
strategies.set('test', uploaderStrategyFake)
strategies.set('production', uploaderStrategyConcrete)
strategies.set('staging', uploaderStrategyConcrete)

module.exports.getUploadStrategy = () => strategies.get(config.env)
module.exports.getBucketPath = () =>
  `${config.bucketPrefix}/${config.bucket}/${config.path}`
