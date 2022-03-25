const Connection = require('tedious').Connection
const Request = require('tedious').Request
const config = require('./config.json')
const _ = require('lodash')

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
  const result = []
  const request = new Request(query, err => {
    if (err) reject(err)
    else resolve(result)
    connection.close()
  })
  request.on('row', row => result.push(
    _.fromPairs(row.map(e => [e.metadata.colName, e.value]))
  ))
  return request
}

const voidRequest = (query, connection, resolve, reject) => {
  const request = new Request(query, err => {
    if (err) reject(err)
    else resolve()
    connection.close()
  })
  return request
}

module.exports = execute
