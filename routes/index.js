const express = require('express');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
var serverBolt = process.env.NEO4J_DEV || "bolt://45.32.234.181:7687";
const driver = neo4j.driver(serverBolt, neo4j.auth.basic("neo4j", "hackernes"));
let session = driver.session();

router.get('/', (req, res, next) => {
    res.send({title: 'Halløj'});
});

router.get('/latest', (req, res, next) => {
    session.run("match (n) 	WITH  max(n.hanesst_id) AS maximum return maximum").then(max => {
        console.log(max.records[0]._fields[0]);
        res.status(200);
        res.send(max.records[0]._fields[0] + "");
    }).catch(err => {
        console.log(err)
    })
});

router.get('/stories', (req, res, next) => {
    session.run("match (b:STORY), p= (b)<-[:COMMENT_ON *0..]-(c) return  b, relationships(p)")
        .then(result => {
            console.log(result)
            var stories = [];
            var comments = [];
            result.records.forEach(item => {
                if (item._fields[0].labels[0] === "STORY") {
                    stories.push()
                } else {

                }
            });
            res.send(JSON.stringify(result));
        });

});

module.exports = router;