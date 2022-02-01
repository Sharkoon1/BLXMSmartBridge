var express = require("express");
const oracle = require("../controllers/oracleController");

var router = express.Router();

router.get("/price", oracle.price);
router.get("/poolData", oracle.poolData);
router.get("/liquidity", oracle.liquidity);

module.exports = router;    