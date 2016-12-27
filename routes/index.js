var express = require('express')
var router = express.Router()
var url = require('url')
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var pg = require('pg')
var Promise = require('bluebird')
var models = require('../models')
var md5 = require('md5')

var lib = require('../lib/functions.js')

/* GET home page. */

// router.get('/', function(req, res, next) {
//  res.json({ title: 'Express' });
router.get('/url', function (req,res){
  var queryUrl = req.query.q
  var testpath = url.parse(queryUrl)
  var options = {
    host: testpath.host,
    port: 80,
    path: testpath.path
  }
  console.log(testpath.host)
  //res.json(testpath)

  http.get(options, function (response) {
    var body = ''
    response.on('data', function (chunk) {
      body += chunk
    })
    response.on('end', function () {
      return models.url.findOne({where: {hash: md5(queryUrl)}}).then(function(result){
        if (result){
          console.log(result);
          res.json({
            status: "ok",
            id: result.id,
            url: queryUrl,
            domain: testpath.host,
            title: result.title,
            description: result.description,
            image_url: result.image_url
          })

        }
        else {

          var cheerioLoad = cheerio.load(body)
          var data ={
            hash: md5(queryUrl),
            title: cheerioLoad('title').text(),
            description: cheerioLoad('meta[name="description"]').attr('content'),
            image_url:cheerioLoad('meta[property="og:image"]').attr('content')
          }
           lib.insertDataToDb(data).then(function(result){

            res.json({
              status: "ok",
              id: result.id,
              url: queryUrl,
              domain: testpath.host,
              title: result.title,
              description: result.description,
              image_url: result.image_url
            })
          })

        }
          console.log(result);
      })

    })
  }).on('error', function (e) {
    console.log("Got error: " + e.message)
  })

})
module.exports = router
