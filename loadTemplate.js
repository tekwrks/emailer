const logger = require('./logger')
const fs = require('fs')
const path = require('path')
const Mustache = require('mustache')

const loadFile = (fp) =>
  new Promise(function (resolve, reject) {
    fs.readFile(path.join(__dirname, fp), 'utf-8', function (err, data) {
      if (err) {
        reject(err)
      }
      logger.debug(`file : ${fp} : loaded`)
      resolve(data)
    })
  })

module.exports = (template) => new Promise(function (resolve, reject) {
  Promise.all([
    loadFile(`${template}.html.mustache`),
    loadFile(`${template}.plain.mustache`),
  ])
    .then(function ([html, plain]) {
      logger.info(`template loaded : ${template}`)

      const renderer = function (view) {
        logger.debug(`rendering : ${template}`)
        return {
          html: Mustache.render(html, view),
          plain: Mustache.render(plain, view),
        }
      }
      resolve(renderer)
    })
    .catch(e => reject(e))
})

