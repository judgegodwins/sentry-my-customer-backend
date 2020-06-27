const router = require("express").Router(),
            ejs = require("ejs");
const Response = require('../util/response_manager');
const HttpStatus = require('../util/http_status');

router.get("*", (req, res) => {
    // res.status(404).json({status: "error", Message: "Endpoint Route Not Valid"})
    Response.failure(res, {error: true, message: "Route not found"}, HttpStatus.NOT_FOUND);
});

module.exports = router;