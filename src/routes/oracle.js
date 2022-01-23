var express = require("express");
const oracle = require("../controllers/oracleController");

var router = express.Router();

router.get("/price", oracle.price);

module.exports = router;    