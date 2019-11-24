const Router = require('express').Router()
const logs = require('./post.logs')

Router.route('/logs').post(logs)

module.exports = Router