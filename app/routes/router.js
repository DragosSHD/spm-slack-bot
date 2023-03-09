const {createChannel} = require("../controllers/slack.controller.js");
const router = require("express").Router();


router.post("/create-channel", createChannel);

router.get("/", async (req, res) => {
   res.status(200).send();
});

module.exports = router;