const { STATUS_CODES } = require('http')
const redisClient = require('./redis')

module.exports = {
    getUserData,
    getKeyValue,
    getGroupValues,
    notFound,
    handleError,
}

async function getUserData(req, res, next) {
    try {
        const { params: { username } } = req
        const userData = await redisClient.getUserData(username)
        if (userData) return res.json({ data: parseDataFromRedis(userData) })
        next()
    } catch (error) {
        next(error)
    }
}

async function getKeyValue(req, res, next) {
    try {
        const { params: { username, key } } = req
        const value = await redisClient.getItemData(username, key)
        if (value) return res.json({ [key]: value })
        next()
    } catch (error) {
        next(error)
    }
}

async function getGroupValues(req, res, next) {
    const { body, params: { username } } = req
    const valuePromise = await body.map(async (key) => {
        const value = await redisClient.getItemData(username, key)
        return { key, value: !!value && value }
    })
    const result = await Promise.all(valuePromise)
    let object = result.reduce((obj, item) => (obj[item.key] = item.value, obj) ,{});
    const hasFalseValue = Object.values(object).includes(false)
    req.result = object
    hasFalseValue ? next() : res.json(object)
}

function handleError(err, req, res, next) {
    if (res.headersSent) return next(err)

    const statusCode = err.status || err.statusCode || err.code || 500
    const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'

    console.error(err)
    res.status(statusCode).json({ error: errorMessage })
}

function notFound(req, res) {
    res.status(404).json({ error: 'Not Found' })
}

function parseDataFromRedis(data) {
    return JSON.parse(data)
}