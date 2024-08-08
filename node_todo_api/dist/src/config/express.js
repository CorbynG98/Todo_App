"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const multer_1 = __importDefault(require("multer"));
const todos_routes_1 = __importDefault(require("../routes/todos.routes"));
const users_routes_1 = __importDefault(require("../routes/users.routes"));
// Some configuration for multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const allowCrossOriginRequests = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
};
const initApp = () => {
    const app = (0, express_1.default)();
    // MIDDLEWARE
    app.use((0, morgan_1.default)('dev'));
    app.use(allowCrossOriginRequests);
    // JSON requests
    app.use(body_parser_1.default.json());
    // x-www-form-urlencoded requests
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // multipart/form-data requests
    app.use(upload.none()); // Use none here, as we are not using images, just text
    // Add CORS middleware
    app.use((0, cors_1.default)());
    // ROUTES
    (0, users_routes_1.default)(app);
    (0, todos_routes_1.default)(app);
    return app;
};
exports.default = initApp();
