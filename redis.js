const redis = require('redis')
const { promisify } = require("util")
const REDIS_PORT = `redis://localhost:6379`
const redisClient = redis.createClient(REDIS_PORT)

module.exports = {
    setRedisData,
    getRedisData,
}

const getAsync = promisify(redisClient.get).bind(redisClient)
const setexAsync = promisify(redisClient.setex).bind(redisClient)

const USER_DATA_KEY = ({username, key}) => `github/${username}/${key}`
const expiry = 60 // 1 minute


async function setRedisData({username, key}, data) {
    return setexAsync(USER_DATA_KEY({ username, key }), expiry, data)
}

async function getRedisData(username, key) {
    return getAsync(USER_DATA_KEY({username, key}))
}

redisClient.on("error", function (error) {
    console.error(error);
});

redisClient.on("connect", function () {
    console.log('Redis connected successfully')
})