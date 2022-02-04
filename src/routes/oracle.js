var express = require("express");
const oracle = require("../controllers/oracleController");
const authentication = require("../middleware/authentication");

var router = express.Router();

router.get("/price", authentication.authenticateToken, oracle.price);
router.get("/poolData", authentication.authenticateToken, oracle.poolData);
router.get("/liquidity", authentication.authenticateToken, oracle.liquidity);

module.exports = router;    