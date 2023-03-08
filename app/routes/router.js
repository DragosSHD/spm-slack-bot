const { publishMessage } = require("../util/slack.js");
const router = require("express").Router();


router.post("/", async (req, res) => {
   console.log('hey!');
   await publishMessage("C04SPF6PVRB", "Hello from API!");
   res.status(200).send();
});

module.exports = router;