const express = require("express");
const router = express.Router();
require("dotenv").config()

const WebSocket = require("ws");
const client = new WebSocket("ws://localhost:8880")

router.get("/", (req, res) => {
    res.render("public/grafica", {});

});

module.exports = router;
