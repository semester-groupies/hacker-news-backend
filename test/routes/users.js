'use strict';

const should = require('should');
const app = require('./../../server');
const handler = require('./../../handlers/taste');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var neo4j = require('neo4j-driver').v1;
// this connection should be imported from a connector module..!!
var serverBolt = 'bolt://hobby-jpaefkaijildgbkeldofdhpl.dbs.graphenedb.com:24786';
const driver = neo4j.driver(serverBolt, neo4j.auth.basic('groupH', 'b.0IbgOsJpXD3Z.EMA8sIRUCi1qQhvr'));
let session = driver.session();


const request = require('supertest')(app);
let salt = handler.salt;

describe('API /routes/users', () => {
  if(process.env.NODE_ENV == 'test')
    beforeEach(function (done) {
      session.run('MATCH (n) DETACH DELETE n')
          .then(function (res) {
            console.log('DB EMPTY');
          })
          .catch(function (err) {
            console.log(err);
          });
      done();
    });

  describe('POST /user/register', () => {
    it('should create a new user', done => {
      var userToCreate = {
        username: 'test',
        password: 'test'
      };
      request
        .post('/user/register')
        .send(userToCreate)
        .expect(200)
        .end((err, res) =>{
          res.status.should.equal(200);
          done(err);
        });
    });
    it('should return 400 and malformed body  , password is missing', done => {
      var userToCreate = {
        username: 'test',
        password: undefined
      };
      request
        .post('/user/register')
        .send(userToCreate)
        .expect(400)
        .end((err, res) =>{
          var error = JSON.parse(res.text);
          error.msg.should.equal('malformed body  , password is missing');
          res.status.should.equal(400);
          done(err);
        });
    });
    it('should return 400 and malformed body  , username is missing', done => {
      var userToCreate = {
        username: undefined,
        password: 'test'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(400)
          .end((err, res) =>{
            var error = JSON.parse(res.text);
            error.msg.should.equal('malformed body  , username is missing');
            res.status.should.equal(400);
            done(err);
          });
    });
    it('should return 400 and malformed body  , username is missing , password is missing', done => {
      var userToCreate = undefined;
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(400)
          .end((err, res) =>{
            var error = JSON.parse(res.text);
            error.msg.should.equal('malformed body  , username is missing , password is missing');
            res.status.should.equal(400);
            done(err);
          });
    });
  });
  describe('POST /user/login', () => {
    it('should create a user and log him in', done => {
      var userToCreate = {
        username: 'test1',
        password: 'test1'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(200)
          .then((res)=>{
              let result = JSON.parse(res.text);
              userToCreate.username = result.username;
            request
              .post('/user/login')
              .send(userToCreate)
              .expect(200)
              .end((err, res) => {
                res.status.should.equal(200);
                done(err);
              });
          });
    });
    it('should return 400 password is missing ', done => {
      var userToCreate = {
        username: 'test',
        password: 'test'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(200)
          .then((res)=>{
              let result = JSON.parse(res.text);
            userToCreate.username = result.username;
            userToCreate.password = undefined;
            request
                .post('/user/login')
                .send(userToCreate)
                .expect(400)
                .end((err, res) => {
                  var error = JSON.parse(res.text);
                  error.msg.should.equal('malformed body  , password is missing');
                  res.status.should.equal(400);
                  done();
                });
          });
    });
    it('should return 400  username is missing ', done => {
      var userToCreate = {
        username: 'test',
        password: 'test'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(200)
          .then((res)=>{
            userToCreate.username = undefined;
            request
                .post('/user/login')
                .send(userToCreate)
                .expect(400)
                .end((err, res) => {
                  var error = JSON.parse(res.text);
                  error.msg.should.equal('malformed body  , username is missing');
                  res.status.should.equal(400);
                  done();
                });
          });
    });
    it('should return 400  username is missing , password is missing ', done => {
      var userToCreate = {
        username: 'test',
        password: 'test'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(200)
          .then((res)=>{

            userToCreate.username = undefined;
            userToCreate.password = undefined;
            request
                .post('/user/login')
                .send(userToCreate)
                .expect(400)
                .end((err, res) => {
                  var error = JSON.parse(res.text);
                  error.msg.should.equal('malformed body  , username is missing , password is missing');
                  res.status.should.equal(400);
                  done();
                });
          });
    });
    it('should return 401 Not a user ', done => {
      var userToCreate = {
        username: 'test',
        password: 'test'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(200)
          .then((res)=>{
            userToCreate.username = 'tester';
            userToCreate.password = 'test';
            request
                .post('/user/login')
                .send(userToCreate)
                .expect(401)
                .end((err, res) => {
                  var error = JSON.parse(res.text);
                  error.msg.should.equal('Not a user');
                  res.status.should.equal(401);
                  done(err);
                });
          });
    });
    it('should return 401 Wrong Password ', done => {
      var userToCreate = {
        username: 'test',
        password: 'test'
      };
      request
          .post('/user/register')
          .send(userToCreate)
          .expect(200)
          .then((res)=>{
            userToCreate.username = 'test';
            userToCreate.password = 'tester';
            request
                .post('/user/login')
                .send(userToCreate)
                .expect(401)
                .end((err, res) => {
                  var error = JSON.parse(res.text);
                  error.msg.should.equal('Wrong Password');
                  res.status.should.equal(401);
                  done(err);
                });
          });
    });
  });
});