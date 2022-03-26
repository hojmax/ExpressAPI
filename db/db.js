const Connection = require('tedious').Connection
const Request = require('tedious').Request
const config = require('./config.json')
const _ = require('lodash')

const execute = (query, parameters, type) => new Promise((resolve, reject) => {
  const connection = new Connection(config)

  connection.on('connect', err => {
    if (err) return reject(err)
    let requestTypes = {
      'get': getRequest,
      'void': voidRequest,
    }
    connection.execSql(requestTypes[type](query, connection, parameters, resolve, reject))
  })

  connection.connect()
})

const addParameters = (request, parameters) => {
  Object.entries(parameters).forEach(([key, value]) => {
    request.addParameter(key, value.type, value.value)
  })
}

const getRequest = (query, connection, parameters, resolve, reject) => {
  const result = []
  const request = new Request(query, err => {
    if (err) reject(err)
    else resolve(result)
    connection.close()
  })
  request.on('row', row => result.push(
    _.fromPairs(row.map(e => [e.metadata.colName, e.value]))
  ))
  addParameters(request, parameters)
  return request
}

const voidRequest = (query, connection, parameters, resolve, reject) => {
  const request = new Request(query, (err, rowCount) => {
    if (err) reject(err)
    else resolve({ rowCount })
    connection.close()
  })
  addParameters(request, parameters)
  return request
}

module.exports = execute
