"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = exports.getByToken = void 0;
const db_1 = require("../config/db");
const insert = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('INSERT INTO Session (session_token, created_at, user_id) VALUES (?, ?, ?);', values, (err, rows) => {
            if (err)
                return reject(err);
            return resolve();
        });
    });
};
exports.insert = insert;
const getByToken = (token) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('SELECT user_id FROM Session WHERE session_token = ? LIMIT 1', token, (err, rows) => {
            if (err)
                return reject(err);
            if (rows == '' || rows == null || rows.length == 0)
                return reject(null);
            return resolve(rows[0].user_id);
        });
    });
};
exports.getByToken = getByToken;
