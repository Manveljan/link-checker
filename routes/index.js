var express = require('express')
var router = express.Router()
var url = require('url')
var http = require('http')
var pg = require('pg')
var Promise = require('bluebird')
var models = require('../models')
var md5 = require('md5')

var lib = require('../lib/functions.js')

router.get('/url', function (req, res) {
  var queryUrl = req.query.q
  var testpath = url.parse(queryUrl)
  var options = {
    host: testpath.host,
    port: 80,
    path: testpath.path
  }

  http.get(options, function (response) {
    var body = ''
    response.on('data', function (add) {
      body += add
    })
    response.on('end', function () {
      return lib.checker(queryUrl, body).then(function (result) {
        res.json({
          status: 'ok',
          id: result.id,
          url: queryUrl,
          domain: testpath.host,
          title: result.title,
          description: result.description,
          image_url: result.image_url
        })
      })
    })
  }).on('error', function (e) {
    console.log('Got error: ' + e.message)
  })
})
module.exports = router
