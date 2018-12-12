'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Amazon Web Services config
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
AWS.config.update({ endpoint: "https://dynamodb.us-east-1.amazonaws.com" });
var docClient = new AWS.DynamoDB.DocumentClient();

// #region All Live Records

    /** READ
    * @api {get} /api/live
    * @apiName GetLive
    * @apiGroup Live
    * @apiDescription Get all records from the 'live' database for the current user.
    *  
    * @apiHeader (Authentication) {String} username Username
    */
    router.get("/", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Get all records from the database, matching the current 'username'
            getAllLive(req.headers.username, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Response: (200 OK) Send the data as the response body.
                    res.status(200).send(data);
                }
            });
        }
        // The 'user' header is not present
        else {
            // Return the error to the user
            res.status(401).send();
        }
    });

    /** DELETE
    * @api {delete} /api/live
    * @apiName DeleteLive
    * @apiGroup Live
    * @apiDescription Delete all records from the 'live' database for the current user.
    *  
    * @apiHeader (Authentication) {String} username Username
    */
    router.delete("/", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // DynamoDB Object
            var params = {
                TableName: "live",
                Key: {
                    "username": req.headers.username
                }
            };
            // DELETE the Object from the DataBase and then run the callback function.
            docClient.delete(params, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Send the data
                    res.send(data);
                }
            });
        }
        // The 'user' header is not present
        else {
            // Return the error to the user
            res.status(401).send();
        }
    });

// #endregion All Live Records

// #region Single Live Record

    /** CREATE
     * @api {post} /api/live
     * @apiName PostLive
     * @apiGroup Live
     * @apiDescription Insert a record into the 'live' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {String} test The test class and name.
     * @apiParam {String} testName The test's method name.
     * @apiParam {String} testClass The test's class name.
     * @apiParam {String} computerName The computer that ran the test.
     * @apiParam {String} description A description of the test.
     * @apiParam {String} duration How long the test took to run.
     * @apiParam {String} startTime When the test started.
     * @apiParam {String} endTime When the test ended.
     * @apiParam {String} outcome The result of the test.
     * @apiParam {String} message The failure message of the test.
     */
    router.post("/", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Define DB item
            var item = {
                test: req.body.test,
                testName: req.body.testName,
                testClass: req.body.testClass,
                computerName: req.body.computerName,
                description: req.body.description || " ",
                duration: req.body.duration,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                outcome: req.body.outcome,
                message: req.body.message || " "
            };
            // DynamoDB Object
            var params = {
                TableName: "live",
                Item: item
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
                    res.status(200).send(data);
                }
            });
        }
        // The 'user' header is not present
        else {
            // Return the error to the user
            res.status(401).send();
        }
    });

    /** READ
     * @api {get} /api/live/:test
     * @apiName GetLiveTest
     * @apiGroup Results
     * @apiDescription Get a record from the 'live' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {String} test The test class and name.
     */
    router.get("/:test", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // DynamoDB Object
            var params = {
                TableName: "live",
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
                    // Response: (200 OK) Send the data as the response body.
                    res.status(200).send(data.Item);
                }
            });
        }
        // The 'user' header is not present
        else {
            // Return the error to the user
            res.status(401).send();
        }
    });

    // Update: /api/live/:test
    // Right now the POST acutally does a PUT and inserts if new.

    /** DELETE
     * @api {delete} /api/live/:test
     * @apiName DeleteLiveTest
     * @apiGroup Results
     * @apiDescription Get a record from the 'live' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {String} test The test class and name.
     */
    router.delete("/:test", function (req, res) {
        if (req.headers.username) {
            var params = {
                TableName: "live",
                Key: {
                    "test": req.params.test,
                    "username": req.headers.username 
                }
            };
            // DELETE the Object from the DataBase
            docClient.delete(params, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Response: (200 OK) Send the data as the response body.
                    res.status(200).send(data);
                }
            });
        }
        // The 'user' header is not present
        else {
            // Return the error to the user
            res.status(401).send();
        }
    });

// #endregion Single Live Record

// Convenience Method - Get all records from the "results" database for the given user.
function getAllLive(username, callback) {
    // DynamoDB Object
    var params = {
        TableName: "live",
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    // GET all the Objects from the DataBase and then run the callback function.
    docClient.scan(params, callback);
}

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;
