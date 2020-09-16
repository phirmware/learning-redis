const express = require('express')
const redis = require('redis')

const app = express()
const api = require('./api')
const middleware = require('./middleware')

module.exports = (port, cb) => app.listen(port, cb)

app.get('/',
    api.checkServer
)

app.get('/github/profile/:username',
    middleware.getDataFromRedis,
    api.getUserData
)

app.get('/github/profile/:username/:key',
    middleware.getDataFromRedis,
    api.getUserInfo
)
