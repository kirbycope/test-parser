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

function getAllLiveResults(callback) {
    // DynamoDB Object
    var params = {
        TableName: "liveresults"
    };
    // GET all the Objects from the DataBase
    docClient.scan(params, callback);
}

function deleteLiveResult(test, callback) {
    // DynamoDB Object
    var params = {
        TableName: "liveresults",
        Key: {
            "test": test
        }
    };
    // Delete the Object from the DataBase
    docClient.delete(params, callback);
}

// Get all "live" test results
router.get("/liveresults", function (req, res) {
    // Check for 'user' header
    if (req.headers.user) {
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
    // Check for 'user' header
    if (req.headers.user) {
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
    // Check for 'user' header
    if (req.headers.user) {
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
    // Check for 'user' header
    if (req.headers.user) {
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

/* UPLOADED RESULTS **************************************************/

// Get all "upload" test results
router.get("/latestresults", function (req, res) {
    // Check for 'user' header
    if (req.headers.user) {
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
    }
    else {
        res.send(401);
    }
});

// Delete all "latest" test results

// Create: /api/latestresults
router.post("/latestresults", function (req, res) {
    // Check for 'user' header
    if (req.headers.user) {
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
    }
    else {
        res.send(401);
    }
});

// Read: /api/latestresults/test001
// TODO

// Update: /api/latestresults/teset001
// Right now the POST acutally does a PUT and inserts if new.

// Delete: /api/latestresults/teset001
// TODO

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
            var lastLogin = new Date().toLocaleString();
            // Handle credentials
            if (dbEmail === formEmail && dbPass === formPass) {
                res.cookie("user", dbUser);
                // Update the lastlogin
                var params2 = {
                    TableName: "users",
                    Key: {
                        "email": req.body.email
                    },
                    UpdateExpression: "set lastLogin = :l",
                    ExpressionAttributeValues: {
                        ":l": lastLogin
                    }
                };
                docClient.update(params2, function (err, data) {
                    // If the DB request returned an error
                    if (err) {
                        // Return the error to the user
                        res.send(err);
                    }
                    else {
                        // Send the data
                        res.send(200, "/" + dbUser + "/dashboard/");
                    }
                });
            }
            else {
                res.send(401, "Invalid credentials.");
            }
        }
    });
});

router.get("/users/profile/:username", function (req, res) {
    // Check for 'user' header
    if (req.headers.user) {
        // DynamoDB Object
        var params = {
            TableName: "users",
            Key: {
                "username": req.params.username
            }
        };
        // GET all the Objects from the DataBase, matching the username
        docClient.scan(params, function (err, data) {
        // If the DB request returned an error
        if (err) {
            // Return the error to the user
            res.send(err);
        }
        else {
            data.Items[0].password = "";
            // Send the data
            res.send(data.Items[0]);
        }
        });
    }
    else {
        res.send(401);
    }
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
        if (data) {
            // Return the error to the user
            return err;
        }
        else {
            return data;
        }
    });
}

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;