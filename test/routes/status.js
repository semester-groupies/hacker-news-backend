'use strict';

const should = require('should');
const app = require('./../../server');
const request = require('supertest')(app);

describe('API /routes/status', ()=> {

  describe('GET /status/status', () => {
    it('should return status Alive',done =>{
      request
        .get('/status/')
        .expect(200)
        .end((err, res) => {
          res.status.should.equal(200);
          res.text.should.equal('Alive');
          done();
        });
    });
  });
});