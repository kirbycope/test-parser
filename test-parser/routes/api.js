'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Amazon Web Services config
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
AWS.config.update({ endpoint: "https://dynamodb.us-east-1.amazonaws.com" });
var docClient = new AWS.DynamoDB.DocumentClient();

function getAllLiveResults(callback) {
    // DynamoDB Object
    var params = {
        TableName: "liveresults"
    };
    // GET all the Objects from the DataBase
    docClient.scan(params, callback);
}

// Get all "live" test results
router.get("/liveresults", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
        getAllLiveResults(function (err, data) {
        // If the DB request returned an error
        if (err) {
            // Return the error to the user
            res.send(err);
        }
        else {
            // Send the data
            res.send(data.Items);
        }
        });
    }
    else {
        res.send(401);
    }
});

// Delete all "live" test results
router.delete("/liveresults", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
        getAllLiveResults(function (err, data) {
        // If the DB request returned an error
        if (err) {
            // Return the error to the user
            res.send(err);
        }
        else {
            for (var item in data.Items) {
                // TODO: foreach, delete
            }
        }
        });
    }
    else {
        res.send(401);
    }
});

// Create: /api/liveresults
router.post("/liveresults", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
        // Define DB item
        var bodyDescription = req.body.description || " ";
        var bodyMessage = req.body.message || " ";
        var unitTestResult = {
            test: req.body.test,
            testName: req.body.testName,
            testClass: req.body.testClass,
            computerName: req.body.computerName,
            description: bodyDescription,
            duration: req.body.duration,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            outcome: req.body.outcome,
            message: bodyMessage
        };
        // DynamoDB Object
        var params = {
            TableName: "liveresults",
            Item: unitTestResult
        };
        // POST the Object to the DataBase
        docClient.put(params, function (err, data) {
            // If the DB request returned an error
            if (err) {
                // Return the error to the user
                res.send(err);
            }
            else {
                // Send the data
                res.send(data.Item);
            }
        });
    }
    else {
        res.send(401);
    }
});

// Read: /api/liveresults/namespace.classname.testname
router.get("/liveresults/:test", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
        // DynamoDB Object
        var params = {
            TableName: "liveresults",
            Key: {
                "test": req.params.test
            }
        };
        // GET the Object from the DataBase
        docClient.get(params, function (err, data) {
        // If the DB request returned an error
        if (err) {
            // Return the error to the user
            res.send(err);
        }
        else {
            // Send the data
            res.send(data.Item);
        }
        });
    }
    else {
        res.send(401);
    }
});

// Update: /api/liveresults/namespace.classname.testname
// Right now the POST acutally does a PUT and inserts if new.

// Delete: /api/liveresults/namespace.classname.testname
router.delete("/liveresults/:test", function (req, res) {
    if (req.headers["user"]) {
        deleteLiveResult(req.params.test, function (err, data) {
            // If the DB request returned an error
            if (err) {
                // Return the error to the user
                res.send(err);
            }
            else {
                // Send the data
                res.status(200).send(data);
            }
        });
    }
    else {
        res.status(401).send();
    }
});

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;
