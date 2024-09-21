import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import logger from 'morgan';
import multer from 'multer';
import todo_routes from '../routes/todos.routes';
import user_routes from '../routes/users.routes';

// Some configuration for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowCrossOriginRequests = function (
  req: Request,
  res: Response,
  next: Function,
) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
};

const initApp = () => {
  const app = express();

  // MIDDLEWARE
  app.use(logger('dev'));
  app.use(allowCrossOriginRequests);
  // JSON requests
  app.use(bodyParser.json());
  // x-www-form-urlencoded requests
  app.use(bodyParser.urlencoded({ extended: true }));
  // multipart/form-data requests
  app.use(upload.none()); // Use none here, as we are not using images, just text
  // Add CORS middleware
  app.use(cors());

  // ROUTES
  user_routes(app);
  todo_routes(app);

  return app;
};

export default initApp();
