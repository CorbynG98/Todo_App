"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.insert = exports.getByUsername = void 0;
const db_1 = require("../config/db");
const getByUsername = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('SELECT * FROM User WHERE username = ? LIMIT 1;', values, (err, rows) => {
            if (err)
                return reject(err);
            if (rows == '' || rows == null || rows.length == 0)
                return reject(null);
            return resolve(rows);
        });
    });
};
exports.getByUsername = getByUsername;
const insert = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('INSERT INTO User (username, password) VALUES (?, ?);', values, (err, rows) => {
            if (err)
                return reject(err);
            return resolve();
        });
    });
};
exports.insert = insert;
const signout = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('DELETE FROM Session WHERE session_token = ?;', values, (err, rows) => {
            if (err)
                return reject(err);
            return resolve();
        });
    });
};
exports.signout = signout;
