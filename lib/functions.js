var models = require('../models')
var md5 = require('md5')
var https = require('https')
var http = require('http')

function insertDataToDb (data) {
  return models.url.create(data).then(function (result) {
    return result
  })
}

function checker (queryUrl, body) {
  return models.url.findOne({
    where: {
      hash: md5(queryUrl)
    }
  }).then(function (result) {
    if (result) {
      return result
    }
    var title = /<title>(.*?)<\/title>/.exec(body)[1]
    var descRegex =
    /<meta.*?name.*?=.*?"description".*?content.*?=.*?"(.*?)".*?>|<meta.*?content.*?=.*?"(.*?)".*?name.*?=.*?"description".*?>/i
    var description = descRegex.exec(body)[1]
    var imgRegex =
    /<meta.*?property.*?=.*?"og:image".*?content.*?=.*?"(.*?)".*?>|<meta.*?content.*?=.*?"(.*?)".*?property.*?=.*?"og:image".*?>/
    var imageUrl = imgRegex.exec(body)[1]
    var data = {
      hash: md5(queryUrl),
      title: title,
      description: description,
      image_url: imageUrl
    }
    return insertDataToDb(data)
  })
}

function getHttpMeta (parsedUrl) {
  return new Promise(function (resolve, reject) {
    var options = {
      host: parsedUrl.host,
      port: 80,
      path: parsedUrl.path
    }
    http.get(options, function (response) {
      var body = ''
      response.on('data', function (add) {
        body += add
      })
      response.on('end', function () {
        return resolve(checker(parsedUrl.href, body))
      })
    }).on('error', function (e) {
      return reject('Got error: ' + e.message)
    })
  })
}

function getHttpsMeta (parsedUrl) {
  return new Promise(function (resolve, reject) {
    var options = {
      host: parsedUrl.host,
      port: 443,
      path: parsedUrl.path
    }
    https.get(options, function (response) {
      var body = ''
      response.on('data', function (add) {
        body += add
      })
      response.on('end', function () {
        return resolve(checker(parsedUrl.href, body))
      })
    }).on('error', function (e) {
      return reject('Got error: ' + e.message)
    })
  })
}

module.exports = {
  insertDataToDb: insertDataToDb,
  checker: checker,
  getHttpsMeta: getHttpsMeta,
  getHttpMeta: getHttpMeta
}
