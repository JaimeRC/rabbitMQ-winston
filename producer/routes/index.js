const Router = require('express').Router()
const success = require('./post.success')
const error = require('./post.success')


Router.route('/logs/success').post(success)

Router.route('/logs/error').post(error)

module.exports = Router