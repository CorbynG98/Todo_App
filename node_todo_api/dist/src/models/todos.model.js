"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleComplete = exports.remove = exports.insert = exports.getAllByUser = exports.clearComplete = void 0;
const db_1 = require("../config/db");
const getAllByUser = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('SELECT todo_id as id, created_at, title, completed FROM Todo WHERE user_id = ?;', values, (err, rows) => {
            if (err)
                return reject(err);
            return resolve(rows);
        });
    });
};
exports.getAllByUser = getAllByUser;
const insert = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('INSERT INTO Todo (todo_id, created_at, title, user_id) VALUES (?, ?, ?, ?);', values, (err, rows) => {
            if (err)
                return reject(err);
            return resolve();
        });
    });
};
exports.insert = insert;
const remove = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('SELECT todo_id as id FROM Todo WHERE todo_id = ? AND user_id = ?;', values, (err, rows) => {
            if (err)
                return reject(err);
            if (rows == '' || rows == null || rows.length == 0)
                return reject({ code: 'ER_NOT_FOUND' });
            (0, db_1.getPool)().query('DELETE FROM Todo WHERE todo_id = ? AND user_id = ?;', values, (err, rows) => {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    });
};
exports.remove = remove;
const toggleComplete = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('SELECT todo_id as id FROM Todo WHERE todo_id = ? AND user_id = ?;', values, (err, rows) => {
            if (err)
                return reject(err);
            if (rows == '' || rows == null || rows.length == 0)
                return reject({ code: 'ER_NOT_FOUND' });
            (0, db_1.getPool)().query('UPDATE Todo SET completed = !completed WHERE todo_id = ? AND user_id = ?;', values, (err, rows) => {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    });
};
exports.toggleComplete = toggleComplete;
const clearComplete = (values) => {
    return new Promise((resolve, reject) => {
        (0, db_1.getPool)().query('DELETE FROM Todo WHERE completed = 1 AND user_id = ?;', values, (err, rows) => {
            if (err)
                return reject(err);
            return resolve();
        });
    });
};
exports.clearComplete = clearComplete;
