const userService = require('./user.service')

module.exports = {
    checkServer,
    getUserData,
    getUserInfo,
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
    res.json({ key: data })
}
