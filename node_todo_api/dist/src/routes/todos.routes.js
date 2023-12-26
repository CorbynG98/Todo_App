"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const todos_controller_1 = require("../controllers/todos.controller");
const authenticate_middleware_1 = __importDefault(require("../util/authenticate.middleware"));
const validateTitle = [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Title is required'),
];
const todo_routes = (app) => {
    app
        .route('/todo')
        .get(authenticate_middleware_1.default, todos_controller_1.list)
        .post([...validateTitle, authenticate_middleware_1.default], todos_controller_1.create);
    app.route('/todo/:id').delete(authenticate_middleware_1.default, todos_controller_1.remove);
    app.route('/todo/:id/toggleComplete').post(authenticate_middleware_1.default, todos_controller_1.toggleComplete);
    app.route('/todo/clearCompleted').post(authenticate_middleware_1.default, todos_controller_1.clearComplete);
};
exports.default = todo_routes;
