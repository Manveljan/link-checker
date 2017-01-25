var express = require('express')
var router = express.Router()
var url = require('url')
var pg = require('pg')
var Promise = require('bluebird')
var models = require('../models')
var md5 = require('md5')
var lib = require('../lib/functions.js')

router.get('/url', function (req, res) {
  var queryUrl = req.query.q
  var parsedUrl = url.parse(queryUrl)
  return Promise.resolve().then(function () {
    return lib.getMetas(parsedUrl)
  }).then(function (result) {
    res.json({
      status: 'ok',
      id: result.id,
      url: parsedUrl.href,
      domain: parsedUrl.host,
      title: result.title,
      description: result.description,
      image_url: result.image_url
    })
  })
})
module.exports = router
