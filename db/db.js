const Connection = require('tedious').Connection
const Request = require('tedious').Request
const config = require('./config.json')

const execute = (query, requestFunction) => new Promise((resolve, reject) => {
  const connection = new Connection(config)

  connection.on('connect', err => {
    if (err) return reject(err)
    connection.execSql(requestFunction(query, resolve, reject))
  })

  connection.connect()
})

const createGetRequest = (query, resolve, reject) => {
  const request = new Request(query, err => err && reject(err))
  let response = []
  request.on('row', columns => {
    let row = {}
    columns.forEach(column => {
      row[column.metadata.colName] = column.value
    })
    response.push(row)
  })
  request.on('doneInProc', () => {
    resolve(response)
  })
  return request
}

const createVoidRequest = (query, resolve, reject) => {
  const request = new Request(query, err => err && reject(err))
  request.on('doneInProc', () => {
    resolve()
  })
  return request
}

const getCustomer = (id) => {
  const query = `SELECT * FROM sales.customers WHERE customer_id = ${id}`
  return execute(query, createGetRequest)
}

const deleteCustomer = (id) => {
  const query = `DELETE FROM sales.customers WHERE customer_id = ${id}`
  return execute(query, createVoidRequest)
}

const insertCustomer = (customer) => {
  // This probably only works for strings given the added citation: '${e}'
  const query = `INSERT INTO sales.customers (${Object.keys(customer)}) VALUES (${Object.values(customer).map(e => `'${e}'`)})`
  return execute(query, createVoidRequest)
}

const updateCustomer = (id, customer) => {
  const query = `UPDATE sales.customers SET ${Object.keys(customer).map(key => `${key}='${customer[key]}'`)} WHERE customer_id = ${id}`
  return execute(query, createVoidRequest)
}

module.exports = {
  getCustomer,
  deleteCustomer,
  insertCustomer,
  updateCustomer
}