const express = require('express');
const router = express.Router();

/**
 * @api {get} /status/ returns the status of the server
 * @apiGroup Status
 * @apiSuccess {String} String String saying Alive!.
 */
router.get('/', (req, res, next) => {
    res.send("Alive");
});

module.exports = router;