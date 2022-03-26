const TYPES = require('tedious').TYPES
const execute = require('../db/db.js')
const _ = require('lodash')

const customerTypes = {
    customer_id: TYPES.Int,
    first_name: TYPES.VarChar,
    last_name: TYPES.VarChar,
    email: TYPES.VarChar,
    phone: TYPES.VarChar,
    city: TYPES.VarChar,
    street: TYPES.VarChar,
    state: TYPES.VarChar,
    zip_code: TYPES.VarChar,
}

const getIdParameters = id => ({
    customer_id: {
        value: id,
        type: customerTypes['customer_id']
    }
})

const getCustomerParamters = customer => (
    _.mapValues(customer, (value, key) => (
        { value, type: customerTypes[key] }
    ))
)

const getCustomer = id => {
    const query = (
        `SELECT * FROM sales.customers
         WHERE customer_id = @customer_id`
    )
    const parameters = getIdParameters(id)
    return execute(
        query,
        parameters,
        'get'
    )
}

const deleteCustomer = id => {
    const query = (
        `DELETE FROM sales.customers
         WHERE customer_id = @customer_id`
    )
    const parameters = getIdParameters(id)
    return execute(
        query,
        parameters,
        'void'
    )
}

const insertCustomer = customer => {
    const query = (
        `INSERT INTO sales.customers (${Object.keys(customer)})
         OUTPUT inserted.customer_id
         VALUES (${Object.keys(customer).map(e => `@${e}`)})`
    )
    const parameters = getCustomerParamters(customer)
    return execute(
        query,
        parameters,
        'get'
    )
}

const updateCustomer = (id, customer) => {
    const query = (
        `UPDATE sales.customers
         SET ${Object.keys(customer).map(key => `${key} = @${key}`)}
         WHERE customer_id = @customer_id`
    )
    const parameters = {
        ...getIdParameters(id),
        ...getCustomerParamters(customer)
    }
    return execute(
        query,
        parameters,
        'void'
    )
}

module.exports = {
    getCustomer,
    deleteCustomer,
    insertCustomer,
    updateCustomer
}