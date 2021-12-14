var express = require("express");
var router = express.Router();
const Authentication = require("../middleware/Authentication");

/* GET home page. */
router.get("/", Authentication.authenticateToken,  function(req, res) {
	res.render("MainPage", { title: "Express" });
});

module.exports = router;
