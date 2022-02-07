const { Pool } = require("pg");

const config = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
}

const pool = new Pool(config);

function findById(id) {
    let res = pool.query("SELECT id, name, email FROM users WHERE id =" + id);
    return res;
}

function findByEmail(email) {
    let res = pool.query("SELECT * FROM users WHERE email ='" + email + "'");
    return res;
}

function create(data) {
    let query = "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email";

    let res = pool.query(query, data);
    return res;
}

module.exports = {
    findById: findById,
    findByEmail: findByEmail,
    create: create
}
