const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('./server.js')
const expect = chai.expect

chai.use(chaiHttp)

describe('Endpoint Tests', () => {
    const testCustomer = {
        customer_id: 212,
        first_name: "Buford",
        last_name: "Bridges",
        phone: "(248) 604-7346",
        email: "buford.bridges@msn.com",
        street: "239 Oak Valley Court ",
        city: "Troy",
        state: "NY",
        zip_code: "12180"
    }
    describe('Check .get(/:id)', () => {
        it('Status 200', done => {
            chai.request(app)
                .get(`/customer/${testCustomer['customer_id']}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.equal(testCustomer)
                    done()
                })
        })
        it('Status 404', done => {
            chai.request(app)
                .get(`/customer/99999`)
                .end((err, res) => {
                    console.log(err)
                    expect(res).to.have.status(404)
                    done()
                })
        })
    })
})