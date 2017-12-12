/*
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

describe('API /routes/post', () => {
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
});*/
