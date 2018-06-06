process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect

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
    it('Expect server to return status 404 for bad route', function(done) {
      chai.request(app).get('/bad-link').end(function (err, res) {
        expect(res).to.have.status(404)
        done()
      })
    })
  })
})

describe('Routes resolve', function () {

  it('/api/timestamp', function (done) {
    chai.request(app).get('/api/timestamp').end(function (err, res) {
      expect(res).to.have.status(200)
      done()
    })
  })

  it('/api/filesize/upload', function (done) {
    chai.request(app).get('/api/filesize/upload').end(function (err, res) {
      expect(res).to.have.status(200)
      done()
    })
  })

  it('/api/whoami', function (done) {
    chai.request(app).get('/api/whoami').end(function (err, res) {
      expect(res).to.have.status(200)
      done()
    })
  })

  it('/api/imagesearch/latest', function (done) {
    chai.request(app).get('/api/imagesearch/latest').end(function (err, res) {
      expect(res).to.have.status(200)
      done()
    })
  })

  it('/shortener/new/', function (done) {
    chai.request(app).get('/shortener/new/').end(function (err, res) {
      expect(res).to.have.status(200)
      done()
    })
  })

  it('/exerciseTracker/', function (done) {
    chai.request(app).get('/exerciseTracker/').end(function (err, res) {
      expect(res).to.have.status(200)
      done()
    })
  })
})