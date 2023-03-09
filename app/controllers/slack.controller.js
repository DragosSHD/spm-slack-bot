const constants = require("../util/const.js");
const slackApp = require("../util/slack.js");
const firebase = require("../util/firebase.js");
const firestore = require("firebase/firestore");

exports.createChannel = async (req, res) => {
    const data = req.body;
    if (!data.name) {
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
        participants: 0
    });
    res.status(200).send();
};












