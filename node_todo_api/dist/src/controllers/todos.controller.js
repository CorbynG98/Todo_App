"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleComplete = exports.remove = exports.list = exports.create = exports.clearComplete = void 0;
const crypto_1 = __importDefault(require("crypto"));
const express_validator_1 = require("express-validator");
const sessions_model_1 = require("../models/sessions.model");
const todos_model_1 = require("../models/todos.model");
const list = async (req, res) => {
    let hashedToken = crypto_1.default
        .createHash('sha512')
        .update(req.header('Authorization'))
        .digest('hex');
    var user_id = await (0, sessions_model_1.getByToken)(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need
    (0, todos_model_1.getAllByUser)(user_id)
        .then((data) => {
        return res.status(200).json(data);
    })
        .catch((err) => {
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.list = list;
const create = async (req, res) => {
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(400).json({ errors: validation.array() });
    }
    let hashedToken = crypto_1.default
        .createHash('sha512')
        .update(req.header('Authorization'))
        .digest('hex');
    var user_id = await (0, sessions_model_1.getByToken)(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need
    let todo_values = [
        [Math.random().toString(16).substring(2, 32)],
        [new Date()],
        [req.body.title],
        [user_id],
    ];
    (0, todos_model_1.insert)(todo_values)
        .then(() => {
        return res.status(204).json();
    })
        .catch((err) => {
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.create = create;
const remove = async (req, res) => {
    let todo_id = req.params.id;
    let hashedToken = crypto_1.default
        .createHash('sha512')
        .update(req.header('Authorization'))
        .digest('hex');
    var user_id = await (0, sessions_model_1.getByToken)(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need
    let values = [[todo_id], [user_id]];
    (0, todos_model_1.remove)(values)
        .then(() => {
        return res.status(204).json();
    })
        .catch((err) => {
        if (err.code == 'ER_NOT_FOUND')
            return res.status(404).json({ status: 404, message: 'Todo not found' });
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.remove = remove;
const toggleComplete = async (req, res) => {
    let todo_id = req.params.id;
    let hashedToken = crypto_1.default
        .createHash('sha512')
        .update(req.header('Authorization'))
        .digest('hex');
    var user_id = await (0, sessions_model_1.getByToken)(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need
    let values = [[todo_id], [user_id]];
    (0, todos_model_1.toggleComplete)(values)
        .then(() => {
        return res.status(204).json();
    })
        .catch((err) => {
        if (err.code == 'ER_NOT_FOUND')
            return res.status(404).json({ status: 404, message: 'Todo not found' });
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.toggleComplete = toggleComplete;
const clearComplete = async (req, res) => {
    let hashedToken = crypto_1.default
        .createHash('sha512')
        .update(req.header('Authorization'))
        .digest('hex');
    var user_id = await (0, sessions_model_1.getByToken)(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need
    let values = [[user_id]];
    (0, todos_model_1.clearComplete)(values)
        .then(() => {
        return res.status(204).json();
    })
        .catch((err) => {
        return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};
exports.clearComplete = clearComplete;
