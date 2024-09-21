import { Express } from 'express';
import { check } from 'express-validator';
import {
  clearComplete,
  create,
  list,
  remove,
  toggleComplete,
} from '../controllers/todos.controller';
import authenticate from '../util/authenticate.middleware';

const validateTitle = [
  check('title').notEmpty().withMessage('Title is required'),
];

const todo_routes = (app: Express) => {
  app
    .route('/v1/todo')
    .get(authenticate, list)
    .post([...validateTitle, authenticate], create);

  app.route('/v1/todo/:id').delete(authenticate, remove);
  app.route('/v1/todo/:id/toggleComplete').post(authenticate, toggleComplete);

  app.route('/v1/todo/clearCompleted').post(authenticate, clearComplete);
};

export default todo_routes;
