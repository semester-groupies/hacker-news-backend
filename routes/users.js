const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
router.get('/', (req, res, next) => {
    res.json({name: 'John', surname: 'Williams'});
});
var neo4j = require('node-neo4j');

db = new neo4j('http://neo4j:hackernes@favl.dk:8474');
var salt = bcrypt.genSaltSync(10);

router.post('/create', (req, res, next) => {
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
            db.cypherQuery("CREATE (n:USER)", {
                n: {
                    username: user.username,
                    password: bcrypt.hashSync(user.password, salt)
                }
            }, function (err, result) {
                if (err) throw err;

                console.log(result.data); // delivers an array of query results
                console.log(result.columns); // delivers an array of names of objects getting returned
                res.status(200);
                res.end()
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