'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Dashboard page
router.get('/', function (req, res) {
    if (req.cookies.user) {
        res.render('dashboard/index', {
            static_path: 'public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    }
    else {
        res.send(401);
    }
});

// Latest Results page
router.get('/latest-results', function (req, res) {
    if (req.cookies.user) {
        res.render('dashboard/latest-results', {
            static_path: '../public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    }
    else {
        res.send(401);
    }
});

// Live Results page
router.get('/live-results', function (req, res) {
    if (req.cookies.user) {
        res.render('dashboard/live-results', {
            static_path: '../public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    }
    else {
        res.send(401);
    }
});

// Test Detail page
router.get('/test-detail', function (req, res) {
    if (req.cookies.user) {
        res.render('dashboard/test-detail', {
            static_path: '../public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            testName: req.query.testName
        });
    }
    else {
        res.send(401);
    }
});

// Upload Results page
router.get('/upload-results', function (req, res) {
    if (req.cookies.user) {
        res.render('dashboard/upload-results', {
            static_path: '../public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false'
        });
    }
    else {
        res.send(401);
    }
});

module.exports = router;
