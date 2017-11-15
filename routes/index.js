const express = require('express');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
var serverBolt =  "bolt://45.32.234.181:7687";
const driver = neo4j.driver(serverBolt, neo4j.auth.basic("neo4j", "hackernes"));


process.on('exit', driver.close);
    router.get('/', (req, res, next) => {
    res.send(process.memoryUsage());
});

router.get('/latest', (req, res, next) => {
    let session = driver.session();
    session.run("match (n) 	WITH  max(n.hanesst_id) AS maximum return maximum").then(max => {
        var result = max.records[0]._fields[0];
        session.close();
        res.status(200);
        res.send(result + "");
    }).catch(err => {
        console.log(err)
    })
});
router.get('/count', (req, res) => {
    let session = driver.session();
    session.run("match (p:STORY) return count(p)")
        .then(result => {
            var count  = result.records[0]._fields[0].low
            let session = driver.session();
            // console.log(count);
            session.close();
            res.send(count+"");
        });
});

router.get('/s',(req,res)=>{

});
router.get('/stories', (req, res, next) => {
    var skipi;
    if (req.query.page)
        skipi = req.query.page * 10;
    else
        skipi = 0;
    let session = driver.session();
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
                var results = item._fields
                session.close();
                return results
            });
            res.send(JSON.stringify(stories, null, 2));
        }).catch(err => {
            console.log(err);
    });

});

router.get('/item/:id', (req, res, next) => {
    var commentId = parseInt(req.params.id);
    let session = driver.session();
    session.run('MATCH p = (s)<-[:COMMENT_ON *0..]-()  where  ID(s)= {id} with collect(p) as items CALL apoc.convert.toTree(items) yield value return value',
        {id: neo4j.int(commentId)})
        .then(function (record) {
            console.log(record);
            if (record.records[0]) {
                var results = record.records[0]._fields[0];
                session.close();
                res.status(200).send(results);
            } else {
                session.close();
                res.status(404).send({msg: 'No Item found with that ID'});
            }
        }).catch(function (error) {

        console.log(error);
    });
});


module.exports = router;