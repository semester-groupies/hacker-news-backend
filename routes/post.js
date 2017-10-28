const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.json({name: 'John', surname: 'Williams'});
});


router.post('/', (req, res, next) => {
    var item = req.body;
    console.log(item.qweqweqweqw)
    console.log(req.body);
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
        console.log(errors);
        console.log("........");
        //start
        if (errors !== "") {
            var msg = new Error();
            msg.status = 400;
            msg.message = "malformed body " + errors;
            res.send(msg);
        }
    } else {
        var msg = new Error();
        msg.status = 400;
        msg.message = "the request was empty!";
        res.send(msg);
    }
});


module.exports = router;