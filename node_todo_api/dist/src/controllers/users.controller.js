"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signout = exports.login = exports.create = void 0;
const crypto_1 = __importDefault(require("crypto"));
const express_validator_1 = require("express-validator");
const sessions_model_1 = require("../models/sessions.model");
const users_model_1 = require("../models/users.model");
/**
 * login: Takes a username and password, and returns a session token if the username and password are correct to a user in the database
 * @param req Request object as defined by Express
 * @param res Response object as defined by Express
 * @returns JSON object with token and username on success, else status and message for error.
 *
 * ===== Errors =====
 *
 * 200: Success
 *
 * 400: Validation error
 *
 * 401: Username or password incorrect
 *
 * 500: Internal server error
 */
const login = async (req, res) => {
    // Pull out of request object, for easier use and manipulation later
    let user_data = {
        username: req.body.username,
        password: req.body.password,
    };
    // Check validation result
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({ errors: validation.array() });
    }
    // Hash password using crypto librarty
    const hash = crypto_1.default.createHash('sha512');
    hash.update(user_data.username + user_data.password);
    // Convert into object better suited to insert into database
    let user_values = [[user_data.username], [hash.digest('hex')]];
    (0, users_model_1.getByUsernameAndPassword)(user_values)
        .then(() => {
        // Create session and return that
        let token = crypto_1.default
            .createHash('sha512')
            .update(crypto_1.default.randomUUID())
            .digest('hex');
        let session_values = [
            [crypto_1.default.createHash('sha512').update(token).digest('hex')],
            [new Date()],
            [user_data.username],
        ];
        // Insert session to databse
        (0, sessions_model_1.insert)(session_values)
            .then(() => {
            return res
                .status(200)
                .json({ token: token, username: user_data.username });
        })
            .catch((err) => {
            return res
                .status(500)
                .json({ status: 500, message: err?.code ?? err });
        });
    })
        .catch((err) => {
        if (err == null) {
            return res
                .status(401)
                .json({ status: 401, message: 'Invalid username or password' });
        }
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.login = login;
/**
 * create: Takes a username and password, creates a user with that data and returns a session token if the username is not already taken
 * @param {Object} req Request object as defined by Express
 * @param {Object} res Response object as defined by Express
 * @returns JSON object with token and username on success, else status and message for error.
 * ===== Errors =====
 *
 * 200: Success
 *
 * 400: Validation error or username already taken
 *
 * 500: Internal server error
 */
const create = async (req, res) => {
    // Pull out of request object, for easier use and manipulation later
    let user_data = {
        username: req.body.username,
        password: req.body.password,
    };
    // Check validation result
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({ errors: validation.array() });
    }
    // Hash password using crypto librarty
    const hash = crypto_1.default.createHash('sha512');
    hash.update(user_data.username + user_data.password);
    // Convert into object better suited to insert into database
    let user_values = [[user_data.username], [hash.digest('hex')]];
    (0, users_model_1.insert)(user_values)
        .then(() => {
        // Create session and return that
        let token = crypto_1.default
            .createHash('sha512')
            .update(crypto_1.default.randomUUID())
            .digest('hex');
        let session_values = [
            [crypto_1.default.createHash('sha512').update(token).digest('hex')],
            [new Date()],
            [user_data.username],
        ];
        // Insert session to databse
        (0, sessions_model_1.insert)(session_values)
            .then(() => {
            return res
                .status(201)
                .json({ token: token, username: user_data.username });
        })
            .catch((err) => {
            return res
                .status(500)
                .json({ status: 500, message: err?.code ?? err });
        });
    })
        .catch((err) => {
        if (err.code == 'ER_DUP_ENTRY') {
            return res
                .status(400)
                .json({ status: 400, message: 'Username already exists' });
        }
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.create = create;
/**
 * signout: Given the users auth token from the request, deletes the current session.
 * @param {Object} req Request object as defined by Express
 * @param {Object} res Response object as defined by Express
 *
 * ===== Errors =====
 *
 * 204: No Content
 *
 * 500: Internal server error
 */
const signout = async (req, res) => {
    let hashedToken = crypto_1.default
        .createHash('sha512')
        .update(req.header('Authorization'))
        .digest('hex');
    // Convert into object better suited to insert into database
    let signout_values = [[hashedToken]];
    (0, users_model_1.signout)(signout_values)
        .then(() => {
        return res.status(204).json();
    })
        .catch((err) => {
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.signout = signout;
