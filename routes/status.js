const express = require('express');
const router = express.Router();
const neo4j = require("neo4j-driver").v1;
var serverBolt = process.env.NEO4J_DEV || "bolt://45.32.234.181:7687";
const driver = neo4j.driver(serverBolt, neo4j.auth.basic("neo4j", "hackernes"));
let session = driver.session();

router.get('/', (req, res, next) => {
    res.send("Alive");
});
router.use(require('express-status-monitor')());

module.exports = router;