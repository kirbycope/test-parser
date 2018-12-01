'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

/* GET 'index' page. */
router.get('/', function (req, res) {
    res.render('dashboard/index', {
        static_path: 'public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

// Latest Results page
router.get('/latest-results', function (req, res) {
    res.render('dashboard/latest-results', {
        static_path: '../public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

// Live Results page
router.get('/live-results', function (req, res) {
    res.render('dashboard/live-results', {
        static_path: '../public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

// Test Detail page
router.get('/test-detail', function (req, res) {
    res.render('dashboard/test-detail', {
        static_path: '../public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        testName: req.query.testName
    });
});

// Upload Results page
router.get('/upload-results', function (req, res) {
    res.render('dashboard/upload-results', {
        static_path: '../public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

module.exports = router;
