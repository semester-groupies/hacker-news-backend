const express = require('express');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
var serverBolt =  "bolt://45.32.234.181:7687";
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
router.get('/count', (req, res) => {
    session.run("match (p:STORY) return count(p)")
        .then(result => {
            console.log(result.records);
            var stories = result.records.map(item => {
                return item._fields
            })
            res.send(JSON.stringify(stories, null, 2));
        });
});

router.get('/stories', (req, res, next) => {
    console.log(req.query.page);
    var skipi;
    if (req.query.page)
        skipi = req.query.page * 10;
    else
        skipi = 0;
    session.run("match (c:STORY)<-[r:COMMENT_ON *0..]-()\n" +
        "with c , count(r) as comments\n" +
        "with  c{.*, comments:comments , id : ID(c)} as commented\n" +
        "return commented skip {skipi} limit 10 \n" +
        "union all MATCH ( c:STORY) \n" +
        "WHERE NOT (c)-[:COMMENT_ON]->()\n" +
        "with  c{.*, comments:0 , id : ID(c)} as commented\n" +
        "return commented  skip {skipi} limit 10", {skipi: skipi})
        .then(result => {
            var stories = result.records.map(item => {
                return item._fields
            });
            res.send(JSON.stringify(stories, null, 2));
        }).catch(err => {
            console.log(err);
    });

});

router.get('/item/:id', (req, res, next) => {
    var commentId = parseInt(req.params.id);
    session.run('MATCH p = (s)<-[:COMMENT_ON *0..]-()  where  ID(s)= {id} with collect(p) as items CALL apoc.convert.toTree(items) yield value return value',
        {id: neo4j.int(commentId)})
        .then(function (record) {
            console.log(record);
            if (record.records[0]) {
                res.status(200).send(record.records[0]._fields[0]);
            } else {
                res.status(404).send({msg: 'No Item found with that ID'});
            }
        }).catch(function (error) {

        console.log(error);
    });
});


module.exports = router;