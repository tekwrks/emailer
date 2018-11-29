/* eslint-disable */

jest.mock('./logger')

const fs = require('fs')
const path = require('path')

// require module
let m = null
beforeAll(() => {
  m = require('./loadTemplate')
  return m
})

test('loads html template', () => {
  const filename = 'filename'
  fs.readFile = jest.fn()
  m(filename)
  expect(fs.readFile.mock.calls[0][0])
    .toBe(path.join(__dirname, `${filename}.html.mustache`))
})
test('loads plain template', () => {
  const filename = 'filename'
  fs.readFile = jest.fn()
  m(filename)
  expect(fs.readFile.mock.calls[1][0])
    .toBe(path.join(__dirname, `${filename}.plain.mustache`))
})

test('returns a template renderer', () => {
  fs.readFile = jest.fn((name, encoding, cb) => cb(null, 'data'))
  expect.assertions(2)
  return m('filename')
    .then((renderer) => {
      const rendered = renderer({})
      expect(rendered.html).toBe('data')
      expect(rendered.plain).toBe('data')
    })
})

test('returned renderer substitutes variables', () => {
  fs.readFile = jest.fn((name, encoding, cb) => cb(null, '{{data}}'))
  expect.assertions(2)
  return m('filename')
    .then((renderer) => {
      const rendered = renderer({data:'hello'})
      expect(rendered.html).toBe('hello')
      expect(rendered.plain).toBe('hello')
    })
})

test('calls reject on template read fault', () => {
  fs.readFile = jest.fn((name, encoding, cb) => cb('error', null))
  expect.assertions(1)
  return m('filename')
    .catch(e => expect(e).toBe('error'))
})
