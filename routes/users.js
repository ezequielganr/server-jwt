const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const route = express.Router();

const postgres = require("../db/postgres");
const secret = require("../config/jwt");
const passport = require("../passport");

route.post("/passport", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    try {
        let r = await postgres.findByEmail(email);

        if (await bcryptjs.compare(password, r.rows[0].password)) {
            let payload = {
                check: true
            }

            let token = jwt.sign(payload, secret.key, {
                expiresIn: "2h"
            });

            res.json({
                token: token,
                data: {
                    id: r.rows[0].id,
                    name: r.rows[0].name,
                    email: r.rows[0].email
                }
            });
        } else {
            res.status(400).json({
                error: "Password is incorrect"
            });
        }
    } catch (e) {
        res.status(400).json({
            error: "The email does not exist"
        });
    }
});

route.get("/verify", passport, async (req, res) => {
    res.json({
        token: "The token is valid"
    });
});

route.post("/create", passport, async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let p = req.body.password;

    try {
        let password = await bcryptjs.hash(p, 8);
        let data = [name, email, password];
        let r = await postgres.create(data);

        res.json({
            data: r.rows[0]
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal server error"
        });
    }
});

route.get("/profile/:id", passport, async (req, res) => {
    let id = req.params.id;

    try {
        let r = await postgres.findById(id);

        res.json({
            data: r.rows[0]
        });
    } catch (e) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = route;
