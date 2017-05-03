const auth = require('basic-auth')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const upload = multer()

const express = require('express')
const app = express()

const bucket = require('./src/gcloud/bucket')

const PORT = process.env.PORT || 3000
const LIMIT = '50mb'

app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json({limit: LIMIT}))
app.use(bodyParser.urlencoded({limit: LIMIT, extended: true}))

app.get('/', (req, res) => {
  res.send('Hello World! My name is uploader!')
})

const doUpload = (req) => {
  if(req.file) return bucket.uploadBuffer(req.body.token, req.file)
  return bucket.uploadBase64(req.body.token, req.body.file)
}

app.post('/upload', upload.single('file'), (req, res) => {
  doUpload(req).then((data) => {
    res.status(201).send(data)
  }).catch((error) => {
    console.error("Erro uploading the file. Reason: ", error)
    switch(error) {
      case "no_file":
        res.status(422).send({error: "Please give us a file to upload"})
        break
      case "unauthorized":
        res.status(401).send({error: "You're unauthorized for this action"})
        break
      case "invalid_file":
        res.status(422).send({error: "The file you gave is invalid"})
        break
      default:
        res.status(500).send({error: "Internal server error"})
    }
  })
})

const validCredentials = (credentials) => {
  let user = process.env.USER
  let pswd = process.env.PSWD

  return (user === undefined && pswd === undefined) ||
    (credentials && credentials.name === user && credentials.pass === pswd)
}

app.get('/token', (req, res) => {
  if (validCredentials(auth(req))) {
    res.status(200).send({token: bucket.generateToken()})
  } else {
    res.status(401).send({error: "You're not authorized to generate tokens"})
  }
})

app.listen(PORT, () => {
  console.log(`Uploader listening on port ${PORT}!`)
})

