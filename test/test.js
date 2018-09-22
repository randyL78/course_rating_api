let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;


chai.use(chaiHttp);

describe('Courses', () => {
  describe('GET', () => {
    it('Should return a status code of 200', done => {
      chai
      .request("http://localhost:5000/")
      .get("api/courses")
      .end( (err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      })
    });
    it('Should get an array of all course objects', done => {
      chai
        .request("http://localhost:5000/")
        .get("api/courses")
        .end( (err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        })
    })
  })
});