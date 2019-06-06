const express = require("express"),

    router = express.Router(),
    {ensureAuthenticated} = require("../config/auth");

// Welcome
router.get("/", (req, res) => res.render("Welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => res.render("dashboard", {user:req.user}));

module.exports = router;