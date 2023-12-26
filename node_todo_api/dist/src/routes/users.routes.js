"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const users_controller_1 = require("../controllers/users.controller");
const authenticate_middleware_1 = __importDefault(require("../util/authenticate.middleware"));
const validateUsernameAndPassword = [
    (0, express_validator_1.check)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required'),
];
const user_routes = (app) => {
    app.route('/auth/signin').post(validateUsernameAndPassword, users_controller_1.login);
    app.route('/auth/signup').post(validateUsernameAndPassword, users_controller_1.create);
    app.route('/auth/signout').post(authenticate_middleware_1.default, users_controller_1.signout);
};
exports.default = user_routes;
