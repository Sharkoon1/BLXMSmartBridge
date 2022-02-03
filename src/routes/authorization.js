var express = require("express");
const AuthorizationController = require("../controllers/authorizationController");

var router = express.Router();

router.post("/login", AuthorizationController.authorize);
router.post("/register", AuthorizationController.register);
router.get("/register:account", AuthorizationController.isRegistered);

module.exports = router;    