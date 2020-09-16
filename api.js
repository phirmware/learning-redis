const fetch = require('node-fetch');
const github_api = `https://api.github.com/users/`

const redisClient = require('./redis')
const mock_data = require('./github.mock.data.json')

module.exports = {
    checkServer,
    getUserData,
    getUserInfo,
}

function checkServer(req, res, next) {
    res.json({ message: 'Application running' })
}

async function getUserData(req, res, next) {
    try {
        res.json(mock_data)
    } catch (error) {
        res.status(500).json(error)
    }
}

async function getUserInfo(req, res, next) {
    try {
        const { params: { username, key } } = req
        const value = mock_data[key]
        if (!value) return res.status(403).json({ message: 'Keep watching' })
        await redisClient.setRedisData({username, key}, value)

        res.json({ key: value })
    } catch (error) {
        res.status(500).json({ message: 'Error' })
    }
}
