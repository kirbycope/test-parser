'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Amazon Web Services config
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
AWS.config.update({ endpoint: "https://dynamodb.us-east-1.amazonaws.com" });
var docClient = new AWS.DynamoDB.DocumentClient();

// #region All Results

    /** READ
     * @api {get} /api/results
     * @apiName GetResults
     * @apiGroup Results
     * @apiDescription Get all records from the 'results' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     */
    router.get("/", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Get all records from the database, matching the current 'username'
            getAllResults(req.headers.username, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    if (req.query.latest) {
                        // Response: (200 OK) Send the data as the response body.
                        res.send(getLatestResults(data));
                    }
                    else if (req.query.last10) {
                        // Response: (200 OK) Send the data as the response body.
                        res.send(getLastTenResults(data));
                    }
                    else {
                        // Response: (200 OK) Send the data as the response body.
                        res.send(data);
                    }
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
     * @api {delete} /api/results
     * @apiName DeleteResults
     * @apiGroup Results
     * @apiDescription Delete all records from the 'results' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     */
    router.delete("/", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // DynamoDB Object
            var params = {
                TableName: "results",
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

// #endregion All Results

// #region Single Results Set

    /** CREATE
     * @api {post} /api/results
     * @apiName PostResults
     * @apiGroup Results
     * @apiDescription Insert a record into the 'results' database for the given unix time stamp and current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {Number} unixtimestamp A Unix Time stamp.
     */
    router.post("/", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Define DB item
            var item = {
                unixtimestamp: req.body.unixtimestamp,
                username: req.headers.username
            };
            // DynamoDB Object
            var params = {
                TableName: "results",
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
     * @api {get} /api/results/:unixtimestamp
     * @apiName GetResultsUnixTimeStamp
     * @apiGroup Results
     * @apiDescription Get a record from the 'results' database for the given unix time stamp and current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {Number} unixtimestamp A Unix Time stamp.
     */
    router.get("/:unixtimestamp", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // DynamoDB Object
            var params = {
                TableName: "results",
                Key: {
                    "unixtimestamp": req.params.unixtimestamp
                }
            };
            // Get the Object from the DataBase
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

    /** UPDATE
     * @api {put} /api/results/:unixtimestamp
     * @apiName PutResults
     * @apiGroup Results
     * @apiDescription Insert a record into the 'results' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {Number} unixtimestamp A Unix Time stamp.
     */
    router.put("/:unixtimestamp", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Define DB item
            var bodyDescription = req.body.description || " ";
            var bodyMessage = req.body.message || " ";
            var unitTestResult =
            {
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
            // DynamoDB Object - Append the test result to the existing results
            var appendResultParams = {
                TableName: "results",
                Key: {
                    "unixtimestamp": req.params.unixtimestamp
                },
                UpdateExpression: "SET #Y = list_append(#Y,:y)",
                ConditionExpression: "attribute_exists(results)",
                ExpressionAttributeNames: {
                    "#Y": "results"
                },
                ExpressionAttributeValues: {
                    ":y": [unitTestResult]
                }
            };
            // UPDATE the Object from the DataBase and then run the callback function.
            docClient.update(appendResultParams, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    if (err.code === "ConditionalCheckFailedException") {
                        // DynamoDB Object - Insert first test result
                        var insertResultParams = {
                            TableName: "results",
                            Key: {
                                "unixtimestamp": req.params.unixtimestamp
                            },
                            UpdateExpression: "SET #Y = :y",
                            ConditionExpression: "attribute_not_exists(results)",
                            ExpressionAttributeNames: {
                                "#Y": "results"
                            },
                            ExpressionAttributeValues: {
                                ":y": [unitTestResult]
                            }
                        };
                        docClient.update(insertResultParams, function (err, data) {
                            // If the DB request returned an error
                            if (err) {
                                // Return the error to the user
                                res.send(err);
                            }
                            else {
                                // Response: (200 OK) Send the data as the response body.
                                res.status(200).send(data.Items);
                            }
                        });
                    }
                    else {
                        // Return the error to the user
                        res.send(err);
                    }
                }
                else {
                    // Response: (200 OK) Send the data as the response body.
                    res.status(200).send(data.Items);
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
         * @api {delete} /api/results/:unixtimestamp
         * @apiName DeleteResultsUnixTimeStamp
         * @apiGroup Results
         * @apiDescription Delete a record from the 'results' database for the given unix time stamp and current user.
         *  
         * @apiHeader (Authentication) {String} username Username
         * 
         * @apiParam {Number} unixtimestamp A Unix Time stamp.
         */
    router.delete("/:unixtimestamp", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // DynamoDB Object
            var params = {
                TableName: "results",
                Key: {
                    "unixtimestamp": req.params.unixtimestamp
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

// #endregion Single Results Set

// Convenience Method - Get all records from the "results" database for the given user.
function getAllResults(username, callback) {
    // DynamoDB Object
    var params = {
        TableName: "results",
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ":username": username
        }
    };
    // GET all the Objects from the DataBase and then run the callback function.
    docClient.scan(params, callback);
}

// Convenience Method - Take res.data and return the latest item.
function getLatestResults(data) {
    var max = data.Items.reduce(function (prev, current) {
        if (+current.unixtimestamp > +prev.unixtimestamp) {
            return current;
        }
        else {
            return prev;
        }
    });
    return max;
}

// Convenience Method - Take res.data and return the last 10 items.
function getLastTenResults(data) {
    // Filter only if there are more than 10 records
    if (data.Items.length > 10) {
        // Get the last 10 records
        var last10 = data.filter(function (el, index) {
            return index >= data.length - 10;
        });
        return last10;
    }
    else {
        return data.Items;
    }
}

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;
