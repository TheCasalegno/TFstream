const express = require("express");
const router = express.Router();
require("dotenv").config()

router.get("/", (req, res) => {
    res.render("public/frontend/alto", {});

});

module.exports = router;
