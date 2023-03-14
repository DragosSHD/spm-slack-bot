const {createChannel, manageEvent} = require("../controllers/slack.controller.js");
const router = require("express").Router();


router.post("/create-channel", createChannel);

router.post("/slack", manageEvent);

module.exports = router;