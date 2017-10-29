const handler = require("../handlers/taste");

const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
router.get('/', (req, res, next) => {
    res.json({name: 'John', surname: 'Williams'});
});
var neo4j = require('neo4j-driver').v1;
var serverBolt = process.env.NEO4J_DEV || "bolt://45.32.234.181:7687";
const driver = neo4j.driver(serverBolt, neo4j.auth.basic("neo4j", "hackernes"));
let salt = handler.salt;
let session = driver.session();

router.post('/register', (req, res, next) => {
    const user = req.body;
    var errors = "";
    if (user) {
        if (!user.hasOwnProperty('username'))
            errors = errors + " , username is missing";
        if (!user.hasOwnProperty('password'))
            errors = errors + " , password is missing";
        if (errors !== "") {
            var msg = new Error();
            msg.status = 400;
            msg.message = "malformed body " + errors;
            res.send(msg);
        } else {
            // TODO: check if username is already in use
            var userToCreate = {
                username: user.username,
                password: bcrypt.hashSync(user.password, salt)
            };
            session.run("CREATE (n:USER {userin} )", {userin: userToCreate})
                .then(function (result) {
                    session.close();
                    res.status(200).send(jwt.sign(user,handler.secret));
                }).catch(function (error) {
                console.log(error);
                res.send(error);
            });

        }
    }
    else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "Empty body";
        res.send(msg);
    }
});


router.post('/login', (req, res, next) => {
    const user = req.body;
    var errors = "";
    if (user) {
        if (!user.hasOwnProperty('username'))
            errors = errors + " , username is missing";
        if (!user.hasOwnProperty('password'))
            errors = errors + " , password is missing";
        if (errors !== "") {
            var msg = new Error();
            msg.status = 400;
            msg.message = "malformed body " + errors;
            res.send(msg);
        } else {
            // TODO: check if username is already in use
            var userToCreate = {
                username: user.username,
                password: bcrypt.hashSync(user.password, salt)
            };
            session.run("Match (n:USER)" +
                "where n.username = {username} " +
                "  return n", {username: userToCreate.username})
                .then(function (record) {
                    console.log(record);
                    if (bcrypt.compareSync(user.password, record._fields[0].properties.password)) {
                        res.status(200).send(record._fields[0]);
                    } else {
                        res.status(401).send("Wrong Username or Password")
                    }
                }).catch(function (error) {
                // console.log(error);
                res.send(error);
            });
        }
    }
    else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "Empty body";
        res.send(msg);
    }
});

router.post('/user', (req, res, next) => {
    const user = req.body;


});
module.exports = router;