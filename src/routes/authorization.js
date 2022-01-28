var express = require("express");
const AuthorizationController = require("../controllers/authorizationController");

var router = express.Router();

router.post("/", AuthorizationController.authorize);

module.exports = router;    