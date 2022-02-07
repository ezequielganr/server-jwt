const express = require("express");
const jwt = require("jsonwebtoken");

const route = express.Router();
const secret = require("./config/jwt");

route.use((req, res, next) => {
    let token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({
            error: "The token is required"
        });
    }

    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, secret.key, (e, decoded) => {
            if (e) {
                return res.status(401).json({
                    error: "The token is invalid"
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }

});

module.exports = route;
