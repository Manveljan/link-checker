var models = require('../models')
var md5 = require('md5')

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
    /<meta.*?name="description".*?content="(.*?)".*?>|<meta.*?content="(.*?)".*?name="description".*?>/i
    var arr = descRegex.exec(body)[1]
    var description = arr[1]
    var imgRegex =
    /<meta.*?property="og:image:url".*?content="(.*?)".*?>|<meta.*?content="(.*?)".*?property="og:image:url".*?>/
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

module.exports = {
  insertDataToDb: insertDataToDb,
  checker: checker
}
