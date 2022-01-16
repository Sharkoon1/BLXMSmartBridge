var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	console.log(router.stack);
	res.send("Found");
});

module.exports = router;
