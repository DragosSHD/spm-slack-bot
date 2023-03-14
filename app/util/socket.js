const { db }  = require("./firebase.js");
const WebSocketClient = require("websocket").client;
const { collection, query, where, getDocs, updateDoc } = require("firebase/firestore");

function acknowledge(envelope_id, con) {
    con.sendUTF(JSON.stringify({envelope_id}));
}

async function handlePayload(payload) {
    if (payload.event.type === 'message') {
        if (payload.event?.subtype === 'channel_join') {
            const q = query(collection(db, "Channels"), where("id", "==", payload.event.channel));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, {
                    participants: doc.data().participants + 1
                }).then(() => {
                    console.log("Document updated!");
                });
            });

        }
    }
}

exports.socketConnect = () => {
    fetch("https://slack.com/api/apps.connections.open", {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${process.env.SLACK_APP_TOKEN}`
        }
    }).then(async res => {
        const response = await res.json();
        if (response.ok) {
            let wssUrl = response.url;
            let socket = new WebSocketClient();

            socket.on('connectFailed', function(error) {
                console.log('Connect Error: ' + error.toString());
            });

            socket.on('connect', function(connection) {
                console.log('WebSocket Client Connected');
                connection.on('error', function(error) {
                    console.log("Connection Error: " + error.toString());
                });
                connection.on('close', function() {
                    console.log('echo-protocol Connection Closed');
                });
                connection.on('message', function(message) {
                    const data = JSON.parse(message.utf8Data);
                    if (data?.payload) {
                        handlePayload(data.payload);
                    }
                    if(data?.envelope_id) {
                        acknowledge(data.envelope_id, connection);
                    }
                });
            });

            socket.connect(wssUrl);
        }
    });
}