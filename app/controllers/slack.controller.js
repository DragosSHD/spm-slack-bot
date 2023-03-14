const constants = require("../util/const.js");
const slackApp = require("../util/slack.js");
const firebase = require("../util/firebase.js");
const firestore = require("firebase/firestore");

exports.createChannel = async (req, res) => {
    const data = req.body;
    if (!data.name || !data.num) {
        res.status(400).send();
        return;
    }
    const result = await slackApp.createChannel(data.name);
    if (!result.ok) {
        res.status(500).send(result.error);
        return;
    }
    const newDoc = firestore.doc(firebase.db,
        constants.firebaseCollections.CHANNELS,
        result.channel.id);
    await firestore.setDoc(newDoc, {
        id: newDoc.id,
        name: result.channel.name,
        participants: 0,
        limitToNo: data.num
    });
    console.log(data);
    res.status(200).send();
};

exports.manageEvent = async (req, res) => {
    const data = req.body;
    if (!Object.keys(data).length) {
        res.status(400).send();
        return;
    }
    if (data.token !== process.env.SLACK_VERIFICATION_TOKEN) {
        res.status(401).send();
        return;
    }
    if (data.type === 'url_verification') {
        res.json({challenge: data.challenge}).send(200);
    }
    res.status(200).send();
};












