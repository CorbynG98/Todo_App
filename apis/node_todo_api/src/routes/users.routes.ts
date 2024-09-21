import { Express } from 'express';
import { check } from 'express-validator';
import { create, login, signout } from '../controllers/users.controller';
import authenticate from '../util/authenticate.middleware';

const validateUsernameAndPassword = [
  check('username').notEmpty().withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required'),
];

const user_routes = (app: Express) => {
  app.route('/auth/signin').post(validateUsernameAndPassword, login);
  app.route('/auth/signup').post(validateUsernameAndPassword, create);
  app.route('/auth/signout').post(authenticate, signout);
};

export default user_routes;
