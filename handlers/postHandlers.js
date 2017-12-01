var neo4j = require('neo4j-driver').v1;
var Promise = require('bluebird');
var bcrypt = require('bcryptjs');
var serverBolt = process.env.NEO4J_DEV || 'bolt://45.32.234.181:7687';
const driver = neo4j.driver(serverBolt, neo4j.auth.basic('neo4j', 'hackernes'));
var salt = require('./taste').salt;
var date_Now = new Date();
const loggerError = require('.././log4js.js').fileError;
const loggerInfo = require('.././log4js.js').fileInfo;

process.on('exit', function () {
    driver.close();
    console.log("closing gracefully")
});

function getUser(username, password) {
    return new Promise((resolve, reject) => {
        let session = driver.session();
        session.run('Match (n:USER)' +
            'where n.username = {username} ' +
            '  return n', {username: username})
            .then(function (record) {
                session.close()
                if (record) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(function (error) {
                session.close()
            // console.log(error);
            resolve(false);
        });
    });
}

function getUserOur(username, password) {
    return new Promise((resolve, reject) => {

        let session = driver.session();
        session.run('Match (n:USER)' +
            'where n.username = {username} ' +
            '  return n', {username: username})
            .then(function (record) {
                session.close();
                if (bcrypt.compareSync(password, record.records[0]._fields[0].properties.password)) {
                    resolve(true);
                    loggerInfo.info("Successfully authenticated user");
                } else {
                    resolve(false);
                    loggerInfo.info("Failed to authenticate user");
                }
            }).catch(function (error) {
                session.close();
            resolve(false);
        });
    });
}

function postStory(req, res) {
    var item = req.body;
    getUser(item.username, item.pwd_hash).then(isUser => {
        if (isUser) {

            let session = driver.session();
            session.run(`Match (n:USER)
                        where n.username = {name} 
                        create (:STORY {s})<-[:POSTED]-(n)`,
                {//(p)<-[:PARENT]-
                    name: item.username,
                    s: {
                        author: item.username,
                        post_title: item.post_title,
                        post_type: item.post_type,
                        post_text: item.post_text,
                        post_url: item.post_url,
                        post_parent: item.post_parent,
                        hanesst_id: item.hanesst_id,
                        created_at: date_Now.toISOString(),
                        score: 0
                    }
                }).then(answer => {
                session.close()
                res.status(200).send('post created');
            }).catch(error => {
                console.log(error);
                session.close()
                res.status(400).send('not created');
                loggerError.error("Failed to post story");
            });
        } else {
            res.status(401).send('invalid user');
        }

    });
};


function postStoryOur(req, res) {
    var item = req.body;
    getUserOur(item.username, item.pwd_hash).then(isUser => {
        if (isUser) {

            let session = driver.session();
            session.run(`Match (n:USER)
                        where n.username = {name} 
                        create (:STORY {s})<-[:POSTED]-(n)`,
                {//(p)<-[:PARENT]-
                    name: item.username,
                    s: {
                        author: item.username,
                        post_title: item.post_title,
                        post_type: item.post_type,
                        post_text: item.post_text,
                        post_url: item.post_url,
                        post_parent: item.post_parent,
                        hanesst_id: item.hanesst_id,
                        created_at: date_Now.toISOString(),
                        score: 0
                    }
                }).then(answer => {
                session.close()
                res.status(200).send('post created');
            }).catch(error => {
                session.close()
                console.log(error);
                res.status(400).send('not created');
            });
        } else {
            res.status(401).send('invalid user');
        }

    });
};

function postComment(req, res) {
    var item = req.body;
    getUser(item.username, item.pwd_hash).then(isUser => {
        if (isUser) {

            let session = driver.session();
            session.run(`Match (n)
                        where n.hanesst_id = {parent} 
                        create (:COMMENT {s})-[:COMMENT_ON]->(n)`,
                {//(p)<-[:PARENT]-
                    parent: item.post_parent,
                    s: {
                        author: item.username,
                        post_title: item.post_title,
                        post_type: item.post_type,
                        post_text: item.post_text,
                        post_url: item.post_url,
                        post_parent: item.post_parent,
                        created_at: date_Now.toISOString(),
                        hanesst_id: item.hanesst_id,
                        vote_up: 0,
                        vote_down: 0
                    }
                }).then(answer => {
                session.close()
                res.status(200).send('comment created');
            }).catch(error => {
                console.log(error);
                session.close()
                res.status(400).send('not created');
            });
        } else {
            res.status(401).send('invalid user');
        }

    });
}

function postPoll(req, res) {
    res.send('poll');

}

function postPollopt(req, res) {
    res.send('pollopt');

}


function postCommentOur(req, res) {
    var item = req.body;
    let session = driver.session();
    console.log(item);
    getUserOur(item.username, item.pwd_hash).then(isUser => {
        if (isUser) {
            session.run(`Match (n)
                        where ID(n) = {parent} 
                        create (:COMMENT {s})-[:COMMENT_ON]->(n)`,
                {//(p)<-[:PARENT]-
                    parent: neo4j.int(item.post_parent),
                    s: {
                        author: item.username,
                        post_title: item.post_title,
                        post_type: item.post_type,
                        post_text: item.post_text,
                        post_url: item.post_url,
                        post_parent: item.post_parent,
                        created_at: date_Now.toISOString(),
                        vote_up: 0,
                        vote_down: 0
                    }
                }).then(answer => {
                session.close();
                res.status(200).send('comment created');
            }).catch(error => {
                session.close();
                console.log(error);
                res.status(400).send('not created');
            });
        } else {
            res.status(401).send('invalid user');
        }

    });
}


function getItem(req, res) {
    var commentId = parseInt(req.params.id);
    let session = driver.session();
    session.run('MATCH p = (s)<-[:COMMENT_ON]-()  where  ID(s)= {id} with collect(p) as items CALL apoc.convert.toTree(items) yield value return value',
        {id: neo4j.int(commentId)})
        .then(function (record) {
            if (record.records[0]) {
                session.close();
                res.status(200).send(record.records[0]);
            } else {
                session.close();
                res.status(404).send({msg: 'No Item found with that ID'});
            }
        }).catch(function (error) {
        console.log(error);
    });
}

module.exports = {
    postStory: postStory,
    postComment: postComment,
    postCommentOur: postCommentOur,
    postStoryOur: postStoryOur,
    postPoll: postPoll,
    postPollopt: postPollopt,
    getItem: getItem
};
