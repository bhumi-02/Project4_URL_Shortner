const express = require('express');
const router = express.Router();
const urlController = require("../controller/url_Controller")


router.post("/url/shorten", urlController.shortUrl)
router.get("/:urlCode", urlController.getShortUrl)

module.exports = router;