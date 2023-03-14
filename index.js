const express = require("express");
const app = express();
const parser = require("body-parser");
const router = require("./app/routes/router.js");
const cors = require("cors");

require("dotenv").config();
app.use(parser.json());

app.use(cors());
app.use("/api/v1", router);
app.use((req, res) => {
    res.status(404).send(
        "<h1>404 - Not Found</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}.`);
})



