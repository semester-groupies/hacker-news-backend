var neo4j = require('neo4j-driver').v1;
var Promise = require("bluebird");
var bcrypt = require("bcryptjs");
var serverBolt = process.env.NEO4J_DEV || "bolt://45.32.234.181:7687";
const driver = neo4j.driver(serverBolt, neo4j.auth.basic("neo4j", "hackernes"));
let session = driver.session();
var salt = require("./taste").salt;
var date_Now = new Date();

function getUser(username, password) {
    return new Promise((resolve, reject) => {
        var userToCreate = {
            username: username,
            password: bcrypt.hashSync(password, salt)
        };
        session.run("Match (n:USER)" +
            "where n.username = {username} " +
            "  return n", {username: userToCreate.username})
            .then(function (record) {
                if (bcrypt.compareSync(password, record.records[0]._fields[0].properties.password)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(function (error) {
            // console.log(error);
            resolve(false);
        })
    })
}

function postStory(req, res) {
    var item = req.body;
    getUser(item.username, item.pwd_hash).then(isUser => {
        console.log(isUser);
        if (isUser) {
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
                console.log(answer);
                res.status(200).send('post created');
            }).catch(error => {
                console.log(error)
                res.status(400).send("not created");
            })
        } else {
            res.status(401).send("invalid user")
        }

    });
};


function postComment(req, res) {
    var item = req.body;
    getUser(item.username, item.pwd_hash).then(isUser => {
        console.log(isUser);
        if (isUser) {
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
                console.log(answer);
                res.status(200).send("comment created");
            }).catch(error => {
                console.log(error)
                res.status(400).send("not created");
            })
        } else {
            res.status(401).send("invalid user")
        }

    });
}

function postPoll(req, res) {
    res.send("poll");

}

function postPollopt(req, res) {
    res.send("pollopt");

}


module.exports = {
    postStory: postStory,
    postComment: postComment,
    postPoll: postPoll,
    postPollopt: postPollopt,
}