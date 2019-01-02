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
                    // Response: (200 OK) Send the data as the response body.
                    res.send(data.Items);
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
     * @api {get} /api/results/lastten
     * @apiName GetResultsLastTen
     * @apiGroup Results
     * @apiDescription Get the last ten records from the 'results' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     */
    router.get("/lastten", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Get the each 'unixtimestamp' from the database, matching the current 'username'
            getAllUnixTimeStamps(req.headers.username, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Filter the list of unixtimestamps to the latest 10
                    var lastTen = getLastTenItems(data);
                    // Get the last ten results
                    getLastTenResults(lastTen, function (err, data) {
                        if (err) {
                            // Return the error to the user
                            res.send(err);
                        }
                        else {
                            // Response: (200 OK) Send the data as the response body.
                            res.status(200).send(data.Responses);
                        }
                    });
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
     * @api {get} /api/results/unixtimestamps?lastTen=true
     * @apiName GetResultsUnixTimeStamps
     * @apiGroup Results
     * @apiDescription Get all unixtimestamps from the 'results' database for the current user.
     *  
     * @apiHeader (Authentication) {String} username Username
     * 
     * @apiParam {Number} unixtimestamp A Unix Time stamp.
     */
    router.get("/unixtimestamps", function (req, res) {
        // Check for 'username' header
        if (req.headers.username) {
            // Get the each 'unixtimestamp' from the database, matching the current 'username'
            getAllUnixTimeStamps(req.headers.username, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Handle '?lastTen=true'
                    var lastTen = getLastTenItems(data);
                    // Response: (200 OK) Send the data as the response body.
                    res.status(200).send(lastTen);
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
            // Create a new record in the 'results' table
            createNewResultRecord(req.body.unixtimestamp, req.headers.username, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Create a new record in the 'unixtimestamps' table
                    createNewUnixtimestampRecord(req.body.unixtimestamp, req.headers.username, function (err, data) {
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
            var unitTestResult =
            {
                test: req.body.test,
                testName: req.body.testName,
                testClass: req.body.testClass,
                configuration: req.body.configuration || " ",
                computerName: req.body.computerName,
                description: req.body.description || " ",
                duration: req.body.duration,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                outcome: req.body.outcome,
                message: req.body.message || " "
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
            // Delete the matching record in the 'results' table
            deleteResultRecord(req.params.unixtimestamp, function (err, data) {
                // If the DB request returned an error
                if (err) {
                    // Return the error to the user
                    res.send(err);
                }
                else {
                    // Create a new record in the 'unixtimestamps' table
                    deleteUnixtimestampRecord(req.body.unixtimestamp, req.headers.username, function (err, data) {
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
            });
        }
        // The 'user' header is not present
        else {
            // Return the error to the user
            res.status(401).send();
        }
    });

// #endregion Single Results Set

// Convenience Method - Take 'unixtimestamp' and 'username' to create records in the 'results' table and then run the callback function.
function createNewResultRecord(unixtimestamp, username, callback) {
    // Define DB item
    var item = {
        unixtimestamp: unixtimestamp,
        username: username
    };
    // DynamoDB Object
    var params = {
        TableName: "results",
        Item: item
    };
    // POST the Object to the DataBase and then run the callback function.
    docClient.put(params, callback);
}

// Convenience Method - Take 'unixtimestamp' and 'username' to create records in the 'unixtimestamps' table and then run the callback function.
function createNewUnixtimestampRecord(unixtimestamp, username, callback) {
    // Define DB item
    var item = {
        unixtimestamp: unixtimestamp,
        username: username
    };
    // DynamoDB Object
    var params = {
        TableName: "unixtimestamps",
        Item: item
    };
    // POST the Object to the DataBase and then run the callback function.
    docClient.put(params, callback);
}

// Convenience Method - Delete a record, whose Partition Key matech the given 'unixtimestamp', from the  'results' table and then run the callback function.
function deleteResultRecord(unixtimestamp) {
    // DynamoDB Object
    var params = {
        TableName: "results",
        Key: {
            "unixtimestamp": unixtimestamp
        }
    };
    // Delete the Object from the DataBase and then run the callback function.
    docClient.delete(params, callback);
}

// Convenience Method - Delete a record, whose Partition Key matech the given 'unixtimestamp', from the  'unixtimestamps' table and then run the callback function.
function deleteUnixtimestampRecord(unixtimestamp) {
    // DynamoDB Object
    var params = {
        TableName: "unixtimestamps",
        Key: {
            "unixtimestamp": unixtimestamp
        }
    };
    // Delete the Object from the DataBase and then run the callback function.
    docClient.delete(params, callback);
}

// Convenience Method - Take res.data (containing the last ten unixtimestamps), get those records, and then run the callback function.
function getLastTenResults(data, callback) {
    // DynamoDB Object
    var params = {
        RequestItems: {
            "results": {
                Keys: [
                    /* TBD (below) */
                ]
            }
        }
    };
    // Populate the keys
    for (var i = 0; i < data.length; i++) {
        params.RequestItems["results"].Keys.push(
            { unixtimestamp: data[i].unixtimestamp }
        );
    }
    // GET all the Objects from the DataBase (matching the given keys) and then run the callback function.
    docClient.batchGet(params, callback);
}

// Convenience Method - Get all records from the "results" table for the given user.
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

// Convenience Method - Get all unixtimestamps from the "results" table for the given user.
function getAllUnixTimeStamps(username, callback) {
    // DynamoDB Object
    var params = {
        TableName: "unixtimestamps",
        FilterExpression: 'username = :username',
        ExpressionAttributeValues: {
            ":username": username
        },
        ProjectionExpression: "unixtimestamp"
    };
    // GET all the Objects from the DataBase and then run the callback function.
    docClient.scan(params, callback);
}

// Convenience Method - Take res.data and return the last 10 items (by unixtimestamp).
function getLastTenItems(data) {
    // Filter only if there are more than 10 records
    if (data.Items.length > 10) {
        // Get the last 10 records
        var arrayToFilter = data.Items;
        var last10 = arrayToFilter.filter(function (el, index) {
            return index >= arrayToFilter.length - 10;
        });
        return last10;
    }
    else {
        return data.Items;
    }
}

// Convenience Method - Take res.data and return the latest item (by unixtimestamp).
function getLatestItemByUnixtimestamp(data) {
    
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

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;
