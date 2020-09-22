const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const api = require('./api')
const middleware = require('./middleware')

module.exports = (port, cb) => app.listen(port, cb)

app.use(bodyParser.json())

app.get('/healthz',
    api.checkServer
)

app.get('/github/profile/:username',
    middleware.getUserData,
    api.getUserData
)

app.get('/github/profile/:username/group',
   middleware.getGroupValues,
   api.getGroupValues,
)

app.get('/github/profile/:username/:key',
    middleware.getKeyValue,
    api.getUserInfo
)

app.use(middleware.notFound)
app.use(middleware.handleError)
