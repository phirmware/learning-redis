const redis = require('redis')
const { promisify } = require("util")
const REDIS_PORT = `redis://localhost:6379`
const redisClient = redis.createClient(REDIS_PORT)

module.exports = {
    setItemData,
    getItemData,
    setUserData,
    getUserData,
}

const getAsync = promisify(redisClient.get).bind(redisClient)
const setexAsync = promisify(redisClient.setex).bind(redisClient)

const ITEM_DATA_KEY = ({ username, key }) => `github/${username}/${key}`
const USER_DATA_KEY = (username) => `github/${username}`
const expiry = 60 // 1 minute


async function setItemData({ username, key }, data) {
    return setexAsync(ITEM_DATA_KEY({ username, key }), expiry, data)
}

async function getItemData(username, key) {
    return getAsync(ITEM_DATA_KEY({ username, key }))
}

async function setUserData(username, data) {
    return setexAsync(USER_DATA_KEY(username), expiry, JSON.stringify(data))
}

async function getUserData(username) {
    return getAsync(USER_DATA_KEY(username))
}

redisClient.on("error", function (error) {
    console.error(error);
});

redisClient.on("connect", function () {
    console.log('Redis connected successfully')
})