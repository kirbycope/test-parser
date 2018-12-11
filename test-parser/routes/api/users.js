'use strict';
// Load the external dependencies (from package.json)
var express = require('express');
var router = express.Router();

// Amazon Web Services config
var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
AWS.config.update({ endpoint: "https://dynamodb.us-east-1.amazonaws.com" });
var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * @api {post} /api/users/login
 * @apiName PostUsersLogin
 * @apiGroup Users
 * @apiDescription Attempts to log the user in.
 */
router.post("/login", function (req, res) {
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
                res.cookie("username", dbUser);
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
                // Return the error to the user
                res.send(401, "Invalid credentials.");
            }
        }
    });
});

/**
 * @api {get} /api/users/profile
 * @apiName GetUsersProfile
 * @apiGroup Users
 * @apiDescription Gets the current users profile.
 */
router.get("/profile", function (req, res) {
    // Check for 'username' header
    if (req.headers.username) {
        // DynamoDB Object
        var params = {
            TableName: "users",
            Key: {
                "username": req.headers.username
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
                // Clear the password
                data.Items[0].password = "";
                // Send the data
                res.send(data.Items[0]);
            }
        });
    }
    // The 'user' header is not present
    else {
        // Return the error to the user
        res.send(401);
    }
});

// Required (https://nodejs.org/api/modules.html#modules_module_exports)
module.exports = router;
