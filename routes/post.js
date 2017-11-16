const express = require('express');
const router = express.Router();
const storyTypes = require("./../enums/postType");
const handler = require("./../handlers/postHandlers");
var log4js = require('log4js');
log4js.configure({
    "appenders": [
        {
            "category": "tests",
            "type": "logLevelFilter",
            "level": "WARN",
            "appender": {
                "type": "log4js-elasticsearch",
                "url": "http://45.77.55.123:9200"
            }
        },
        {
            "category": "tests",
            "type": "console"
        }
    ],
    "levels": {
        "tests": "DEBUG"
    }
});
var log = log4js.getLogger('tests');

router.get('/', (req, res, next) => {
    res.json({name: 'John', surname: 'Williams'});
});

router.post('/postItem', (req, res, next) => {
    var item = req.body;
    var errors = "";
    if (item) {
        if (!item.hasOwnProperty('username'))
            errors = errors + " , username is missing";
        if (!item.hasOwnProperty('post_type'))
            errors = errors + " , post_type is missing";
        if (!item.hasOwnProperty('post_title'))
            errors = errors + " , post_title is missing";
        if (!item.hasOwnProperty('post_url'))
            errors = errors + " , post_url is missing";
        if (!item.hasOwnProperty('post_parent'))
            errors = errors + " , post_parent is missing";
        if (!item.hasOwnProperty('hanesst_id'))
            errors = errors + " , hanesst_id is missing";
        if (!item.hasOwnProperty('post_text'))
            errors = errors + " , post_text is missing";
        //start
        if (errors !== "") {
            var msg = new Error();
            msg.status = 400;
            msg.message = "malformed body " + errors;
            res.send(msg);
            log.error(msg.message);
        } else {
            if (item.post_type == storyTypes.story) {
                handler.postStoryOur(req, res);
            } else if (item.post_type == storyTypes.comment) {
                handler.postCommentOur(req, res);
            } else if (item.post_type == storyTypes.poll) {
                handler.postPoll(req, res);
            } else if (item.post_type == storyTypes.pollopt) {
                handler.postPollopt(req, res);
            }
        }
    } else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "the request was empty!";
        res.send(msg);
        log.error(msg.message);
    }
});


router.post('/', (req, res, next) => {
    var item = req.body;
    var errors = "";
    if (item) {
        console.log(item.hasOwnProperty('username'));
        if (!item.hasOwnProperty('username'))
            errors = errors + " , username is missing";
        if (!item.hasOwnProperty('post_type'))
            errors = errors + " , post_type is missing";
        if (!item.hasOwnProperty('pwd_hash'))
            errors = errors + " , pwd_hash is missing";
        if (!item.hasOwnProperty('post_title'))
            errors = errors + " , post_title is missing";
        if (!item.hasOwnProperty('post_url'))
            errors = errors + " , post_url is missing";
        if (!item.hasOwnProperty('post_parent'))
            errors = errors + " , post_parent is missing";
        if (!item.hasOwnProperty('hanesst_id'))
            errors = errors + " , hanesst_id is missing";
        if (!item.hasOwnProperty('post_text'))
            errors = errors + " , post_text is missing";
        //start
        if (errors !== "") {
            var msg = new Error();
            msg.status = 400;
            msg.message = "malformed body " + errors;
            res.send(msg);
        } else {
            if (item.post_type == storyTypes.story) {
                handler.postStory(req, res);
            } else if (item.post_type == storyTypes.comment) {
                handler.postComment(req, res);
            } else if (item.post_type == storyTypes.poll) {
                handler.postPoll(req, res);
            } else if (item.post_type == storyTypes.pollopt) {
                handler.postPollopt(req, res);
            }
        }
    } else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "the request was empty!";
        res.send(msg);
    }
});

router.get('/item/single/:id', (req, res, next) => {
    handler.getItem(req, res);
});

module.exports = router;