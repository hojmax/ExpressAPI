const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('./server.js')
const expect = chai.expect
const _ = require('lodash')

chai.use(chaiHttp)

describe('/customer', () => {
    let newCustomerId = undefined
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
    describe('.put(/:id)', () => {
        it('Alter city', done => {
            chai.request(app)
                .put(`/customer/${testCustomer.customer_id}`)
                .send({ city: 'test_city' })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    done()
                })
        })
        it('Alter city to previous value', done => {
            chai.request(app)
                .put(`/customer/${testCustomer.customer_id}`)
                .send(_.pick(testCustomer, 'city'))
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    done()
                })
        })
        it('Handle non-integer id', done => {
            chai.request(app)
                .put(`/customer/a`)
                .send({ city: 'test_city' })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Handle invalid column', done => {
            chai.request(app)
                .put(`/customer/${testCustomer.customer_id}`)
                .send({ invalid_property: true })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Handle non-existent customer', done => {
            chai.request(app)
                .put(`/customer/99999999`)
                .send({ city: 'test_city' })
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    done()
                })
        })
    })
    describe('.post(/)', () => {
        it('Missing first_name', done => {
            chai.request(app)
                .post('/customer')
                .send(_.omit(testCustomer, 'first_name'))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Missing last_name', done => {
            chai.request(app)
                .post('/customer')
                .send(_.omit(testCustomer, 'last_name'))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Missing email', done => {
            chai.request(app)
                .post('/customer')
                .send(_.omit(testCustomer, 'email'))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Badly formatted email', done => {
            chai.request(app)
                .post('/customer')
                .send({
                    first_name: 'test_first_name',
                    last_name: 'test_last_name',
                    email: 'badly_formatted'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Handle invalid column', done => {
            chai.request(app)
                .post('/customer')
                .send({
                    invalid_property: true,
                    first_name: 'test_first_name',
                    last_name: 'test_last_name',
                    email: 'test@email.dk'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
        it('Create new customer', done => {
            chai.request(app)
                .post('/customer')
                .send(_.omit(testCustomer, 'customer_id'))
                .end((err, res) => {
                    expect(res.body).to.have.own.property('customer_id')
                    expect(res.body.customer_id).to.be.a('number')
                    expect(res).to.have.status(200)
                    newCustomerId = res.body.customer_id
                    done()
                })
        })
    })
    describe('.delete(/:id)', () => {
        it('Delete newly created customer', done => {
            chai.request(app)
                .delete(`/customer/${newCustomerId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    done()
                })
        })
        it('Error when deleting non-existent customer', done => {
            chai.request(app)
                .delete(`/customer/${newCustomerId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    done()
                })
        })
        it('Handle non-integer id', done => {
            chai.request(app)
                .delete(`/customer/a`)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
    })
    describe('.get(/:id)', () => {
        it('Get correct customer', done => {
            chai.request(app)
                .get(`/customer/${testCustomer.customer_id}`)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.equal(testCustomer)
                    done()
                })
        })
        it('Check the deleted customer is non-existent', done => {
            chai.request(app)
                .get(`/customer/${newCustomerId}`)
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    done()
                })
        })
        it('Handle non-integer id', done => {
            chai.request(app)
                .get(`/customer/a`)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    done()
                })
        })
    })
})