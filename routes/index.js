const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
	res.send({ title: 'Helloy' });
});

module.exports = router;