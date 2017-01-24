var express = require('express')
var router = express.Router()
var url = require('url')
var pg = require('pg')
var Promise = require('bluebird')
var models = require('../models')
var md5 = require('md5')
var lib = require('../lib/functions.js')
var fs = require('fs')

var Canvas = require('canvas'),
  Image = Canvas.Image,
  canvas = new Canvas(300, 300),
  ctx = canvas.getContext('2d')

ctx.strokeStyle = 'blue'
ctx.lineWidth = 20
ctx.strokeRect(50, 50, 150, 150)
ctx.font = '30px Impact'
ctx.fillStyle = '#8A2BE2'
ctx.fillText('aaaaaa', 70, 150)
ctx.fillRect(80, 90, 80, 20)

router.get('/', function (req, res) {
  out = fs.createWriteStream(__dirname + '/test.png')
  stream = canvas.pngStream()

  stream.on('data', function (add) {
    out.write(add)
  })

  stream.on('end', function () {
    console.log('ok')
  })
})

router.get('/url', function (req, res) {
  var queryUrl = req.query.q
  var parsedUrl = url.parse(queryUrl)
  return Promise.resolve().then(function () {
    return lib.getMetas(parsedUrl)
  }).then(function (result) {
    // console.log(result)
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
