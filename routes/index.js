const express = require('express');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
var Promise = require("bluebird");
var serverBolt = "bolt://45.32.234.181:7687";
const driver = neo4j.driver(serverBolt, neo4j.auth.basic("neo4j", "hackernes"));

var async = require('async');

process.on('exit', driver.close);

/**
 * @api {get} / Returns memory usage information for the server
 * @apiGroup Index
 */
router.get('/', (req, res, next) => {


    var mem = process.memoryUsage();
    var memory = {freeHeap: ((mem.heapUsed * 100) / mem.heapTotal).toFixed(2) + "%", objects: mem.external};
    var resp = {
        memoryUsage: mem, memory: memory
    }
    res.send(JSON.stringify(resp, null, 4));

});

/**
 * @api {get} /latest Returns the latest hanesst_id
 * @apiGroup Index
 * @apiSuccess {Number} hanesst_id Hanesst_id
 */
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

/**
 * @api {get} /count Returns the total number of Stories
 * @apiGroup Index
 * @apiSuccess {Number} count total count of stories
 */
router.get('/count', (req, res) => {
    let session = driver.session();
    session.run("match (p:STORY) return count(p)")
        .then(result => {
            var count = result.records[0]._fields[0].low
            let session = driver.session();
            // console.log(count);
            session.close();
            res.send(count + "");
        });
});

router.get('/s', (req, res) => {

});

/**
 * @api {get} /stories Returns the stories for the feed, 20 at a time
 * @apiGroup Index
 * @apiSuccess {JSON} results JSON containing 20 stories, with comments
 */
router.get('/stories', (req, res, next) => {
    var skipi;
    if (req.query.page)
        skipi = req.query.page * 10;
    else
        skipi = 0;
    let session = driver.session();
    session.run("MATCH (n:STORY)return n   skip {skipi} limit 20", {skipi: skipi})
        .then(result => {
            var stories = []
            var smList = []
            stories.push(new Promise((resolve, reject) => {
                result.records.map(item => {
                    var results = item._fields
                    smList.push(new Promise((resolve, reject) => {
                        results.map(item => {//start n=NODE(409824) match (n:STORY)-[r:COMMENT_ON *.. ]-() return count(r)-1 as comments
                            session.run("match (n:STORY) where ID(n) = {id} match (n:STORY)-[r:COMMENT_ON *.. ]-(:COMMENT) return count(r) as c"
                                , {id: neo4j.int(item.identity.low) })
                                .then(rec => {
                                    console.log(req);
                                    item.properties.comments = rec.records[0]._fields[0].low;
                                    item.properties.id = item.identity.low;
                                    resolve(item.properties)
                                }).catch(err => console.log(err))
                        })
                    }))
                });
                Promise.all(smList).then(fullfil => {
                    resolve(fullfil)
                })
            }));

            Promise.all(stories).then(fullfil => {
                res.send(JSON.stringify(fullfil[0], null, 2))
            })

        }).catch(err => {
        session.close();
        console.log(err);
    });

})
;

/*
old query : MATCH (n:STORY)<-[r:COMMENT_ON *..]- ()  with  n{.*, comments:((count(r)-1)) , id : ID(n)} as commented return (commented) order by commented.created_at skip {skipi} limit 20
 */

/*
 *  get the number of comments in story
 *
 *   start n=NODE(409564) match (n:STORY)-[r:COMMENT_ON *.. ]-() return count(r)
 *
 *
 */


/**
 * @api {get} /item/:id Returns a story or comment by id
 * @apiGroup Index
 * @apiParam {Number} id The id of the story/comment to return.
 * @apiSuccess {JSON} results JSON containing the story/comment
 */
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