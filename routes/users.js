const handler = require('../handlers/taste');

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
router.get('/', (req, res, next) => {
    res.json({name: 'John', surname: 'Williams'});
});
let session;
let driver;
var neo4j = require('neo4j-driver').v1;
if(process.env.NODE_ENV == 'test'){
    var serverBolt = 'bolt://hobby-jpaefkaijildgbkeldofdhpl.dbs.graphenedb.com:24786';
    driver = neo4j.driver(serverBolt, neo4j.auth.basic('groupH', 'b.0IbgOsJpXD3Z.EMA8sIRUCi1qQhvr'));
    session = driver.session();
}else {


    var serverBolt = process.env.NEO4J_DEV || 'bolt://45.32.234.181:7687';
    driver = neo4j.driver(serverBolt, neo4j.auth.basic('neo4j', 'hackernes'));
    session = driver.session();
}

process.on('exit', driver.close);
let salt = handler.salt;



/**
 * @api {post} /users/register  Register and Log in a new User
 * @apiGroup User
 * @apiParam {String} username username of the User.
 * @apiParam {String} password password of the User.
 * @apiSuccess {String} JWT JWT containing information about the user.
 */
router.post('/register', (req, res, next) => {

    const user = req.body;
    var errors = '';
        if (!user.hasOwnProperty('username'))
            errors = errors + ' , username is missing';
        if (!user.hasOwnProperty('password'))
            errors = errors + ' , password is missing';
        if (errors !== '') {
            var msg = 'malformed body ' + errors;
            res.status(400).send({ msg: msg });
        } else {
            // TODO: check if username is already in use
            var userToCreate = {
                username: user.username,
                password: bcrypt.hashSync(user.password, salt),
            };
            session = driver.session();
            session.run("MERGE(id:UniqueId{name:'USER'}) ON CREATE SET id.count = 1" +
                ' ON MATCH SET id.count = id.count + 1 ' +
                ' WITH id.count AS uid ' +
                'CREATE (n:USER {userin} )', {userin: userToCreate})
                .then(function (result) {
                    session.close();
                    res.status(200).send({ username: userToCreate.username, password: userToCreate.password });
                }).catch(function (error) {
                session.close();
                console.log(error);
                res.send(error);
            });

        }
});

/**
 * @api {post} /users/login  Log in a User
 * @apiGroup User
 * @apiParam {String} username username of the User.
 * @apiParam {String} password password of the User.
 * @apiSuccess {String} JWT JWT containing information about the user.
 */
router.post('/login', (req, res, next) => {
    const user = req.body;
    var errors = '';
        if (!user.hasOwnProperty('username'))
            errors = errors + ' , username is missing';
        if (!user.hasOwnProperty('password'))
            errors = errors + ' , password is missing';
        if (errors !== '') {
            var msg = 'malformed body ' + errors;
            res.status(400).send({ msg: msg });
        } else {
            // TODO: check if username is already in use
            var userToCreate = {
                username: user.username,
                password: bcrypt.hashSync(user.password, salt)
            };
            session = driver.session();
            session.run('Match (n:USER)' +
                'where n.username = {username} ' +
                '  return n', {username: userToCreate.username})
                .then(function (record) {
                        const username = record.records[0]._fields[0].properties.username;
                        const password = record.records[0]._fields[0].properties.password;
                        if (bcrypt.compareSync(user.password, password)) {
                            session.close();
                            res.status(200).send({ username: username, password: password });
                        } else {
                            session.close();
                            res.status(401).send({ msg: 'Wrong Password' });
                        }
                }).catch(function (error) {
                session.close();
                res.status(401).send({ msg: 'Not a user' });
            });
        }
});

module.exports = router;
