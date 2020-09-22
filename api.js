const userService = require('./user.service')

module.exports = {
    checkServer,
    getUserData,
    getUserInfo,
    getGroupValues,
}

function checkServer(req, res, next) {
    res.json({ message: 'Application running' })
}

async function getUserData(req, res, next) {
    const { params: { username } } = req
    const { error, user } = await userService.getUserData(username)
    if (error) return res.status(400).json({ message: error })
    res.json(user)
}

async function getUserInfo(req, res, next) {
    const { params: { username, key } } = req
    const { error, data } = await userService.getUserInfo({ username, key })
    if (error) return res.status(400).json({ message: error })
    res.json({ [key]: data })
}

async function getGroupValues(req, res, next) {
    const { result, params: { username, key } } = req
    const entries = Object.entries(result)
    const arrPromise = await entries.map(async entrie => {
        const [ key, value ] = entrie
        if (value) return { key, value }
        const { error, data } = await userService.getUserInfo({ username, key })
        if (error) return { key, value: '' }
        return { key, value: data }
    })
    const arr = await Promise.all(arrPromise)
    let object = arr.reduce((obj, item) => (obj[item.key] = item.value, obj) ,{});
    res.json(object)
}
