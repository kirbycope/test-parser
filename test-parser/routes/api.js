'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;

// Amazon Web Services config
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
AWS.config.update({ endpoint: "https://dynamodb.us-east-1.amazonaws.com" });
var docClient = new AWS.DynamoDB.DocumentClient();

/* LIVE RESULTS ****************************************************/

// Get all "live" test results
router.get("/liveresults", function (req, res) {
    // DynamoDB Object
    var params = {
        TableName: "liveresults"
    };
    // GET all the Objects from the DataBase
    docClient.scan(params, function (err, data) {
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
});

// Create: /api/liveresults
router.post("/liveresults", function (req, res) {
    // Check for 'user' header
    if (req.cookies.user) {
        // Define DB item
        var unitTestResult = {
            testName: req.body.testName,
            testClass: req.body.testClass,
            computerName: req.body.computerName,
            duration: req.body.duration,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            outcome: req.body.outcome,
            message: req.body.message
        };
        try {
            // Send the item to the DB
            updateDBO("liveresults", unitTestResult);
            // Return the response from the DB
            res.send(data.Items);
        }
        catch (err) {
            // Return the error to the user
            res.send(err);
        }
    }
    else {
        res.send(401);
    }
});

// Read: /api/liveresults/test001
router.get("/liveresults/:testName", function (req, res) {
    // DynamoDB Object
    var params = {
        TableName: "liveresults",
        Key: {
            "testName": req.params.testName
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
});

// Update: /api/liveresults/test001
// TODO

// Delete: /api/liveresults/test001
router.delete("/liveresults/:testname", function (req, res) {
    // As a pseudo-security measure, require a Request Header with an email address
    if (req.headers["email"]) {
        // DynamoDB Object
        var params = {
            TableName: "liveresults",
            Key: {
                "testname": Number(req.params.testname)
            }
        };
        // Delete the Object from the DataBase
        docClient.delete(params, function (err, data) {
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

/* LATEST RESULTS **************************************************/

// Get all "latest" test results
router.get("/latestresults", function (req, res) {
    // DynamoDB Object
    var params = {
        TableName: "latestresults"
    };
    // GET all the Objects from the DataBase
    docClient.scan(params, function (err, data) {
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
});

// Create: /api/latestresults
router.post("/latestresults", function (req, res) {
    // Convert the file buffer to a string
    var resultsFile = req.files.file.data.toString();
    // Parse the string as JSON
    parseString(resultsFile, function (err, result) {
        // Get all test results
        var unitTestResults = result.TestRun.Results[0].UnitTestResult;
        var testDefinitions = result.TestRun.TestDefinitions[0].UnitTest;
        
        // Upload each result
        for (var i = 0; i < unitTestResults.length; i++) {
            // Get the Unit Test's Result
            var testName = unitTestResults[i].$.testName;
            var failureMessage = " ";
            try { failureMessage = unitTestResults[i].Output[0].ErrorInfo[0].Message; } catch (err) { /* do nothing */ }
            // Get the Unit Test's Test Definition
            var unitTest = testDefinitions.filter(function (record) {
                return record.$.name === testName;
            });
            var testClass = " ";
            try { testClass = unitTest.TestMethod[0].$.className; } catch (err) { /* do nothing */ }
            var unitTestResult = {
                testName: testName,
                testClass: testClass,
                computerName: unitTestResults[i].$.computerName,
                duration: unitTestResults[i].$.duration,
                startTime: unitTestResults[i].$.startTime,
                endTime: unitTestResults[i].$.endTime,
                outcome: unitTestResults[i].$.outcome,
                message: failureMessage
            };
            updateDBO("latestresults", unitTestResult);
        }
        res.send("File uploaded!");
    });
});

// Read: /api/latestresults/test001
//TODO

// Update: /api/latestresults/teset001
//TODO

// Delete: /api/latestresults/teset001
//TODO

/* USERS ***********************************************************/

// Post: /api/users/login
router.post("/users/login", function (req, res) {
    // DynamoDB Object
    var params = {
        TableName: "users",
        Key: {
            "email": req.body.email
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
            // Define credentials
            var dbEmail = data.Item.email;
            var dbPass = data.Item.password;
            var dbUser = data.Item.username;
            var formEmail = req.body.email;
            var formPass = req.body.password;
            // Handle credentials
            if (dbEmail === formEmail && dbPass === formPass) {
                res.cookie("user", dbUser);
                res.send(200, "/" + dbUser + "/dashboard/");
            }
            else {
                res.send(401, "Invalid credentials.");
            }
        }
    });
});

/* HELPERS *********************************************************/

function updateDBO(tableName, item) {
    // DynamoDB Object
    var params = {
        TableName: tableName,
        Item: item
    };
    // POST the Object to the DataBase
    docClient.put(params, function (err, data) {
        // If the DB request returned an error
        if (err) {
            // Return the error to the user
            res.send(err);
        }
    });
}

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;