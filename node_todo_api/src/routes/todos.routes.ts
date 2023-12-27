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
    .route('/todo')
    .get(authenticate, list)
    .post([...validateTitle, authenticate], create);

  app.route('/todo/:id').delete(authenticate, remove);
  app.route('/todo/toggleComplete/:id').post(authenticate, toggleComplete);

  app.route('/todo/clearCompleted').post(authenticate, clearComplete);
};

export default todo_routes;
