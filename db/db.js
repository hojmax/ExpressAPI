const Connection = require('tedious').Connection
const Request = require('tedious').Request
const config = require('./config.json')
const _ = require('lodash')

function createRequest(query, connection, reject) {
  return new Request(query, err => {
    connection.close()
    if (err) reject(err)
  })
}

const execute = (query, type) => new Promise((resolve, reject) => {
  const connection = new Connection(config)

  connection.on('connect', err => {
    if (err) return reject(err)
    let requestTypes = {
      'get': getRequest,
      'void': voidRequest,
    }
    connection.execSql(requestTypes[type](query, connection, resolve, reject))
  })

  connection.connect()
})

const getRequest = (query, connection, resolve, reject) => {
  const request = createRequest(query, connection, reject)
  const result = []
  request.on('row', row => result.push(
    _.fromPairs(row.map(e => [e.metadata.colName, e.value]))
  ))
  request.on('doneInProc', () => resolve(result))
  return request
}

const voidRequest = (query, connection, resolve, reject) => {
  const request = createRequest(query, connection, reject)
  request.on('doneInProc', () => resolve())
  return request
}

module.exports = execute
