const execute = require('./db.js')

const getCustomer = id => {
    const query = `SELECT * FROM sales.customers WHERE customer_id = ${id}`
    return execute(query, 'get')
}

const deleteCustomer = id => {
    const query = `DELETE FROM sales.customers WHERE customer_id = ${id}`
    return execute(query, 'void')
}

const insertCustomer = customer => {
    const query = `INSERT INTO sales.customers (${Object.keys(customer)}) VALUES (${Object.values(customer).map(e => `'${e}'`)})`
    return execute(query, 'void')
}

const updateCustomer = (id, customer) => {
    const query = `UPDATE sales.customers SET ${Object.keys(customer).map(key => `${key}='${customer[key]}'`)} WHERE customer_id = ${id}`
    return execute(query, 'void')
}

module.exports = {
    getCustomer,
    deleteCustomer,
    insertCustomer,
    updateCustomer
}