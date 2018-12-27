'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Dashboard page "./app/dashboard"
router.get('/dashboard', function (req, res) {
    if (req.cookies.username) {
        res.render('dashboard', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username
        });
    }
    else {
        res.status(401).send();
    }
});

// Latest Upload page "./app/latest-upload"
router.get('/latest-upload', function (req, res) {
    if (req.cookies.username) {
        res.render('latest-upload', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username
        });
    }
    else {
        res.status(401).send();
    }
});

// Live Results page "./app/live"
router.get('/live', function (req, res) {
    if (req.cookies.username) {
        res.render('live', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username
        });
    }
    else {
        res.status(401).send();
    }
});

// Login page "./app/login"
router.get('/login', function (req, res) {
    res.render('login', {
        static_path: '/public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});

// Logout page "./app/logout"
router.get('/logout', function (req, res) {
    res.clearCookie("user");
    res.render('login', {
        static_path: '/public',
        theme: process.env.THEME || 'default',
        flask_debug: process.env.FLASK_DEBUG || 'false'
    });
});


// Profile page "./app/profile"
router.get('/profile', function (req, res) {
    if (req.cookies.username) {
        res.render('profile', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username
        });
    }
    else {
        res.status(401).send();
    }
});

// Results page "./app/results/:unixtimestamp"
router.get('/results/:unixtimestamp', function (req, res) {
    if (req.cookies.username) {
        res.render('results', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username,
            unixtimestamp: req.params.unixtimestamp
        });
    }
    else {
        res.status(401).send();
    }
});

// Test Detail page "./app/test-detail"
router.get('/test-detail', function (req, res) {
    if (req.cookies.username) {
        res.render('test-detail', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username,
            test: req.query.test
        });
    }
    else {
        res.status(401).send();
    }
});

// Upload Results page "./app/upload-results"
router.get('/upload-results', function (req, res) {
    if (req.cookies.username) {
        res.render('upload-results', {
            static_path: '/public',
            theme: process.env.THEME || 'default',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            username: req.cookies.username
        });
    }
    else {
        res.status(401).send();
    }
});

module.exports = router;
