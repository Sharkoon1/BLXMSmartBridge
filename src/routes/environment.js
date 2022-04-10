let express = require("express");
const EnvironmentController = require("../controllers/environmentController");
const authentication = require("../middleware/authentication");
let router = express.Router();

router.get("/", authentication.authenticateToken, authentication.authenticateToken, EnvironmentController.getEnviroment);

module.exports = router;





