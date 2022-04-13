const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('./server.js')
const expect = chai.expect
const _ = require('lodash')

chai.use(chaiHttp)

let bearerToken = undefined

describe('/login', () => {
    describe('.post(/)', () => {
        it('Successful login', done => {
            chai.request(app)
                .post('/login')
                .send({
                    email: 'test@test.dk',
                    password: 'string',
                })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.text).to.be.a('string')
                    bearerToken = `Bearer ${res.text}`
                    done()
                })
        })
        it('Wrong email', done => {
            chai.request(app)
                .post('/login')
                .send({
                    email: 'test@tost.dk',
                    password: 'string',
                })
                .end((err, res) => {
                    expect(res).to.have.status(401)
                    expect(res.text).to.equal('Invalid email or password')
                    done()
                })
        })
        it('Wrong password', done => {
            chai.request(app)
                .post('/login')
                .send({
                    email: 'test@test.dk',
                    password: 'strong',
                })
                .end((err, res) => {
                    expect(res).to.have.status(401)
                    expect(res.text).to.equal('Invalid email or password')
                    done()
                })
        })
        it('Invalid email', done => {
            chai.request(app)
                .post('/login')
                .send({
                    email: '@test.dk',
                    password: 'string',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"email" must be a valid email')
                    done()
                })
        })
    })
})

describe('/customer', () => {
    let newCustomerId = undefined
    const testCustomer = {
        customer_id: 212,
        first_name: 'Buford',
        last_name: 'Bridges',
        phone: '(248) 604-7346',
        email: 'buford.bridges@msn.com',
        street: '239 Oak Valley Court ',
        city: 'Troy',
        state: 'NY',
        zip_code: '12180'
    }
    describe('.put(/:id)', () => {
        it('Alter city', done => {
            chai.request(app)
                .put(`/customer/${testCustomer.customer_id}`)
                .set('authorization', bearerToken)
                .send({ city: 'test_city' })
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.text).to.equal('Success')
                    done()
                })
        })
        it('Alter city to previous value', done => {
            chai.request(app)
                .put(`/customer/${testCustomer.customer_id}`)
                .set('authorization', bearerToken)
                .send(_.pick(testCustomer, 'city'))
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.text).to.equal('Success')
                    done()
                })
        })
        it('Handle non-integer id', done => {
            chai.request(app)
                .put(`/customer/a`)
                .set('authorization', bearerToken)
                .send({ city: 'test_city' })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"id" must be a number')
                    done()
                })
        })
        it('Handle invalid column', done => {
            chai.request(app)
                .put(`/customer/${testCustomer.customer_id}`)
                .set('authorization', bearerToken)
                .send({ invalid_property: true })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"invalid_property" is not allowed')
                    done()
                })
        })
        it('Handle non-existent customer', done => {
            chai.request(app)
                .put(`/customer/99999999`)
                .set('authorization', bearerToken)
                .send({ city: 'test_city' })
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.text).to.equal('Customer not found')
                    done()
                })
        })
    })
    describe('.post(/)', () => {
        it('Missing first_name', done => {
            chai.request(app)
                .post('/customer')
                .set('authorization', bearerToken)
                .send(_.omit(testCustomer, ['first_name', 'customer_id']))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"first_name" is required')
                    done()
                })
        })
        it('Missing last_name', done => {
            chai.request(app)
                .post('/customer')
                .set('authorization', bearerToken)
                .send(_.omit(testCustomer, ['last_name', 'customer_id']))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"last_name" is required')
                    done()
                })
        })
        it('Missing email', done => {
            chai.request(app)
                .post('/customer')
                .set('authorization', bearerToken)
                .send(_.omit(testCustomer, ['email', 'customer_id']))
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"email" is required')
                    done()
                })
        })
        it('Badly formatted email', done => {
            chai.request(app)
                .post('/customer')
                .set('authorization', bearerToken)
                .send({
                    first_name: 'test_first_name',
                    last_name: 'test_last_name',
                    email: 'badly_formatted'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"email" must be a valid email')
                    done()
                })
        })
        it('Handle invalid column', done => {
            chai.request(app)
                .post('/customer')
                .set('authorization', bearerToken)
                .send({
                    invalid_property: true,
                    first_name: 'test_first_name',
                    last_name: 'test_last_name',
                    email: 'test@email.dk'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"invalid_property" is not allowed')
                    done()
                })
        })
        it('Create new customer', done => {
            chai.request(app)
                .post('/customer')
                .set('authorization', bearerToken)
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
                .set('authorization', bearerToken)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.text).to.equal('Success')
                    done()
                })
        })
        it('Error when deleting non-existent customer', done => {
            chai.request(app)
                .delete(`/customer/${newCustomerId}`)
                .set('authorization', bearerToken)
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.text).to.equal('Customer not found')
                    done()
                })
        })
        it('Handle non-integer id', done => {
            chai.request(app)
                .delete(`/customer/a`)
                .set('authorization', bearerToken)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"id" must be a number')
                    done()
                })
        })
    })
    describe('.get(/:id)', () => {
        it('Get correct customer', done => {
            chai.request(app)
                .get(`/customer/${testCustomer.customer_id}`)
                .set('authorization', bearerToken)
                .end((err, res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.deep.equal(testCustomer)
                    done()
                })
        })
        it('Check the deleted customer is non-existent', done => {
            chai.request(app)
                .get(`/customer/${newCustomerId}`)
                .set('authorization', bearerToken)
                .end((err, res) => {
                    expect(res).to.have.status(404)
                    expect(res.text).to.equal('Customer not found')
                    done()
                })
        })
        it('Handle non-integer id', done => {
            chai.request(app)
                .get(`/customer/a`)
                .set('authorization', bearerToken)
                .end((err, res) => {
                    expect(res).to.have.status(400)
                    expect(res.text).to.equal('"id" must be a number')
                    done()
                })
        })
    })
})