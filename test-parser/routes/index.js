'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Home page
router.get('/', function (req, res) {
    res.render('index', {
        static_path: 'public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

module.exports = router;
