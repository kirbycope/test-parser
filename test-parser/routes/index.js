'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Dashboard page
router.get('/:username/dashboard', function (req, res) {
    if (req.cookies.user) {
        res.render('dashboard', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            user: req.cookies.user
        });
    }
    else {
        res.send(401);
    }
});

// Home page
router.get('/', function (req, res) {
    res.render('index', {
        static_path: 'public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

// Latest Upload page
router.get('/:username/latest-upload', function (req, res) {
    if (req.cookies.user) {
        res.render('latest-upload', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            user: req.cookies.user
        });
    }
    else {
        res.send(401);
    }
});

// Live Results page
router.get('/:username/live-results', function (req, res) {
    if (req.cookies.user) {
        res.render('live-results', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            user: req.cookies.user
        });
    }
    else {
        res.send(401);
    }
});

// Login page
router.get('/login', function (req, res) {
    res.clearCookie("user");
    res.render('index', {
        static_path: 'public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        user: req.cookies.user
    });
});

// Logout page
router.get('/logout', function (req, res) {
    res.clearCookie("user");
    res.render('index', {
        static_path: '/public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

// Profile page
router.get('/:username/profile', function (req, res) {
    if (req.cookies.user) {
        res.render('profile', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            user: req.cookies.user
        });
    }
    else {
        res.send(401);
    }
});

// Test Detail page
router.get('/:username/test-detail', function (req, res) {
    if (req.cookies.user) {
        res.render('test-detail', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            user: req.cookies.user,
            test: req.query.test
        });
    }
    else {
        res.send(401);
    }
});

// Upload Results page
router.get('/:username/upload-results', function (req, res) {
    if (req.cookies.user) {
        res.render('upload-results', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            user: req.cookies.user
        });
    }
    else {
        res.send(401);
    }
});

module.exports = router;
