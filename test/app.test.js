process.env.NODE_ENV = 'test'

const chai = require('chai')
const should = chai.should()

chai.use(require('chai-http'))

const app = require('../app')

describe('Main app functionality', function () {
  before(function (done) {
    app.on('serverOK', function () {
      done()
    })
  })
  //test 404 page
  describe('/404 error', function () {
    it('should return an error for bad route', function(done) {
      chai.request(app).get('/bad-link').end(function(err, res) {
        res.should.have.status(404)
        done()
      })
    })
  })
})