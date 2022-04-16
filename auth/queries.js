const execute = require('../db/db.js')
const { TYPES } = require('tedious')

const getHashPass = email => {
    const query = (
        `SELECT hash_pass FROM dbo.user_info
         WHERE email = @email`
    )
    const parameters = {
        email: {
            value: email,
            type: TYPES.VarChar
        }
    }
    return execute(
        query,
        parameters,
        'get'
    )
}

module.exports = { getHashPass }