//this will install hell yeahs users, with a salt of 1..
const brcypt = require('bcryptjs');
const fs = require('fs');
var neo4j = require('neo4j-driver').v1;
const salt = require('../handlers/taste').salt;
var serverBolt = process.env.NEO4J_DEV || 'bolt://45.32.234.181:7687';
const driver = neo4j.driver(serverBolt, neo4j.auth.basic('neo4j', 'hackernes'));
let session = driver.session();
const lineReader = require('line-reader');
let count1 = 0;

lineReader.eachLine('usersAll.csv', function(line, last){
  var info = line.split(',');
  if(info[0] == 'user');
  else {
    var userObject = {};
    userObject.username = info[0];
    userObject.password = brcypt.hashSync(info[1], salt);
    count1 ++;
    console.log(count1);
    insert(userObject);
  }

  if(last){
    console.log('last : ', last);
  }

});

function insert(user){
  var resultPromise = session.run('CREATE (n:USER {userin} )',{ userin: user });
  return resultPromise.then(function (result) {
    session.close();
  }).catch(function (error) {
    console.error(error);
  });
}

