const fetch = require('node-fetch');

const redisClient = require('./redis')
const mock_data = require('./github.mock.data.json')

const github_api = `https://api.github.com/users/`

module.exports = {
    getUserData,
    getUserInfo,
}

async function getUserData(username) {
    try {
        const jsonData = await fetch(`${github_api}${username}`)
        const data = await jsonData.json()
        await redisClient.setUserData(username, data)
        return sendResponse(null, data)
    } catch (error) {
        return sendResponse('Something went wrong saving data to redis', null)
    }
}

async function getUserInfo({ username, key }) {
    try {
        const jsonData = await fetch(`${github_api}${username}`)
        const data = await jsonData.json()
        await redisClient.setItemData({ username, key }, data[key])
        return sendResponse(null, data[key])
    } catch (error) {
        return sendResponse('Something went wrong saving the data to redis', null)
    }
}

function sendResponse(error, data) {
    return { error, data }
}