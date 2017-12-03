const express = require('express');
const router = express.Router();
const storyTypes = require("./../enums/postType");
const handler = require("./../handlers/postHandlers");
const loggerError = require('.././log4js.js').fileError;
const loggerInfo = require('.././log4js.js').fileInfo;

router.get('/', (req, res, next) => {
    res.json({name: 'John', surname: 'Williams'});
});

/**
 * @api {post} /post/postItem
 * @apiGroup Post
 * @apiParam {String} username username of the user
 * @apiParam {String} post_type post_type of the story
 * @apiParam {String} post_title post_title of the story
 * @apiParam {String} post_url post_url of the story
 * @apiParam {String} post_parent post_parent of the story
 * @apiParam {String} hanesst_id hanesst_id of the story
 * @apiParam {String} post_text post_text of the story
 * @apiDescription Used for posting an item
 */

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
            loggerError.error(msg.message);
            res.send(msg);
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
            loggerInfo.info("Successfully posted an item");
        }
    } else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "the request was empty!";
        res.send(msg);
        loggerError.error(msg.message);
    }
});

/**
 * @api {post} /post
 * @apiGroup Post
 * @apiParam {String} username username of the user
 * @apiParam {String} post_type post_type of the story
 * @apiParam {String} post_title post_title of the story
 * @apiParam {String} post_url post_url of the story
 * @apiParam {String} post_parent post_parent of the story
 * @apiParam {String} hanesst_id hanesst_id of the story
 * @apiParam {String} post_text post_text of the story
 * @apiDescription Used for posting an item
 */

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
            loggerError.error(msg.message);
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
            loggerInfo.info("Successfully posted an item");
        }
    } else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "the request was empty!";
        loggerError.error(msg.message);
        res.send(msg);
    }
});

router.get('/item/single/:id', (req, res, next) => {
    handler.getItem(req, res);
});

module.exports = router;