const redisClient = require('./redis')

module.exports = {
    getDataFromRedis,
}

async function getDataFromRedis(req, res, next) {
    try {
        const { params: { username, key } } = req
        const data = await redisClient.getRedisData(username, key)
        console.log(data, 'data from redis')
        if (!data || data === null) return next()

        res.json(data)
    } catch (error) {
        next(error)
    }
}