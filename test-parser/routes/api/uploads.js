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

/**
 * @api {get} /api/uploads/latest
 * @apiName GetUploadsLatest
 * @apiGroup Uploads
 * @apiDescription Get all records from the 'latestresults' database for the current user.
 *  
 * @apiHeader (Authentication) {String} username Username
 */
router.get("/latest", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
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

/**
 * @api {post} /api/uploads/latest
 * @apiName PostUploadsLatest
 * @apiGroup Uploads
 * @apiDescription Insert/Update a record into the 'latestresults' database for the current user.
 *  
 * @apiHeader (Authentication) {String} username Username
 */
router.post("/latest", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
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
                putDBO("latestresults", unitTestResult);
            }
            res.send("File uploaded!");
        });
    }
    else {
        res.send(401);
    }
});

// Convenience Method - PUT the given item in the given table.
function putDBO(tableName, item) {
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
