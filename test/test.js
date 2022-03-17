const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server.js')
const assert = chai.assert
const expect = chai.expect

chai.should()

chai.use(chaiHttp)

describe('Math.max() Tests', () => {
    it('Returning number', () => {
        // Type 1
        assert.typeOf(Math.max(1, 2), 'number')
    })
    it('Returning max value', () => {
        // Type 2
        expect(Math.max(1, 2)).to.equal(2)
    })
    it('Returning -inf for no arguments', () => {
        expect(Math.max()).to.equal(-Infinity)
    })
    it('Returning NaN when passed non-number argument', () => {
        assert.isNaN(Math.max('a', 1))
    })
})



describe('Endpoint Tests', () => {
    const serverState = [
        {
            id: 0,
            name: 'potato',
            price: 3,
            quantity: 3,
            shop: 'Netto'
        }
    ]
    describe('Check .post(/list)', () => {
        it('Status 200', (done) => {
            const obj = {
                name: 'rice',
                price: 5,
                quantity: 10,
                shop: 'Lidl'
            }
            serverState.push({ ...obj, id: 1 })
            chai.request(app)
                .post('/list')
                .send(obj)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.deep.equal(serverState)
                    done()
                })
        })
        it('Status 400', (done) => {
            const obj = {
                name: 'rice',
                price: -1,
                quantity: 10,
                shop: 'Lidl'
            }
            chai.request(app)
                .post('/list')
                .send(obj)
                .end((err, res) => {
                    res.should.have.status(400)
                    done()
                })
        })
    })
    describe('Check .get(/list/all)', () => {
        it('No limit', (done) => {
            chai.request(app)
                .get('/list/all')
                .end((err, res) => {
                    res.body[0].should.have.property('id')
                    res.should.have.status(200)
                    res.body.should.deep.equal(serverState)
                    done()
                })
        })
        it('limit=1', (done) => {
            const limit = 1
            chai.request(app)
                .get('/list/all')
                .query({ limit: limit })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.length.should.equal(limit)
                    done()
                })
        })
    })
})