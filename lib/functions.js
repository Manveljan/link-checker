var models = require('../models')
var md5 = require('md5')
var https = require('https')
var http = require('http')

function insertDataToDb (data) {
  return models.url.create(data).then(function (result) {
    return result
  })
}

function getUrlInfoFromDb (queryUrl) {
  return models.url.findOne({
    where: {
      hash: md5(queryUrl)
    }
  })
}

function generateUrlInfoData (queryUrl, body) {
  var title = /<title>(.*?)<\/title>/
  var description = /<meta.*?name.*?=.*?"description".*?content.*?=.*?"(.*?)".*?>|<meta.*?content.*?=.*?"(.*?)".*?name.*?=.*?"description".*?>/
  var imageUrl = /<meta.*?property.*?=.*?"og:image".*?content.*?=.*?"(.*?)".*?>|<meta.*?content.*?=.*?"(.*?)".*?property.*?=.*?"og:image".*?>/
  return {
    hash: md5(queryUrl),
    title: title.exec(body)[1],
    description: description.exec(body)[1],
    image_url: imageUrl.exec(body)[1]
  }
}

function getMetas (parsedUrl) {
  return getUrlInfoFromDb(parsedUrl.href).then(function (result) {
    if (result) {
      return result
    }
    return getBodyFromUrl(parsedUrl).then(function (body) {
      var data = generateUrlInfoData(parsedUrl.href, body)
      return insertDataToDb(data)
    })
  })
}

function getBodyFromUrl (parsedUrl) {
  var options = {
    host: parsedUrl.host,
    port: 80,
    path: parsedUrl.path
  }
  var protocol = http
  if (parsedUrl.protocol === 'https:') {
    options.port = 443
    protocol = https
  }
  return getUrlMeta(protocol, parsedUrl, options)
}

function responseParser (response) {
  return new Promise(function (resolve, reject) {
    var body = ''
    response.on('data', function (add) {
      body += add
    })
    response.on('end', function () {
      return resolve(body)
    })
  })
}

function getUrlMeta (protocol, parsedUrl, options) {
  return new Promise(function (resolve, reject) {
    protocol.get(options, function (response) {
      return responseParser(response).then(function (result) {
        return resolve(result)
      })
    }).on('error', function (e) {
      return reject('Got error: ' + e.message)
    })
  })
}

// ////////////////////////////////////////////////

module.exports = {
  insertDataToDb: insertDataToDb,
  getMetas: getMetas

}
