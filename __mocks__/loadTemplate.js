const Mustache = require('mustache')

function templateRenderer (template) {
  return new Promise(function (resolve, reject) {
    const renderer = function (view) {
      return {
        html: Mustache.render(templateRenderer.__template, view),
        plain: Mustache.render(templateRenderer.__template, view),
      }
    }
    resolve(renderer)
  })
}
templateRenderer.__template = ''

module.exports = templateRenderer

