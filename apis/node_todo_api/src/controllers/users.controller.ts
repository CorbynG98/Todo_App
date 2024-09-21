import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { insert as session_insert } from '../models/sessions.model';
import UserResource, {
  getByUsername,
  signout as signout_user,
  insert as user_insert,
} from '../models/users.model';

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
const login = async (req: Request, res: Response) => {
  // Pull out of request object, for easier use and manipulation later
  let user_data = {
    username: req.body.username,
    password: req.body.password,
  } as UserResource;

  // Check validation result
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.array() });
  }

  // Convert into object better suited to insert into database
  let user_values = [[user_data.username]];

  getByUsername(user_values)
    .then((result) => {
      // Check password is valid, I guess
      let valid = bcrypt.compareSync(user_data.password, result[0].password);
      if (!valid) {
        return res
          .status(401)
          .json({ status: 401, message: 'Invalid username or password' });
      }
      // Create session and return that
      let token = crypto
        .createHash('sha512')
        .update(crypto.randomUUID())
        .digest('hex');
      let session_values = [
        [crypto.createHash('sha512').update(token).digest('hex')],
        [new Date()],
        [user_data.username],
      ];
      // Insert session to databse
      session_insert(session_values)
        .then(() => {
          return res
            .status(200)
            .json({ session_token: token, username: user_data.username });
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
const create = async (req: Request, res: Response) => {
  // Pull out of request object, for easier use and manipulation later
  let user_data = {
    username: req.body.username,
    password: req.body.password,
  } as UserResource;

  // Check validation result
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.array() });
  }

  // Hash password using crypto librarty
  let hash = await bcrypt.hash(user_data.password, 12)
  // Convert into object better suited to insert into database
  let user_values = [[user_data.username], [hash]];

  user_insert(user_values)
    .then(() => {
      // Create session and return that
      let token = crypto
        .createHash('sha512')
        .update(crypto.randomUUID())
        .digest('hex');
      let session_values = [
        [crypto.createHash('sha512').update(token).digest('hex')],
        [new Date()],
        [user_data.username],
      ];
      // Insert session to databse
      session_insert(session_values)
        .then(() => {
          return res
            .status(201)
            .json({ session_token: token, username: user_data.username });
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
const signout = async (req: Request, res: Response) => {
  let hashedToken = crypto
    .createHash('sha512')
    .update(req.header('Authorization') as string)
    .digest('hex');

  // Convert into object better suited to insert into database
  let signout_values = [[hashedToken]];

  signout_user(signout_values)
    .then(() => {
      return res.status(204).json();
    })
    .catch((err) => {
      return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};

export { create, login, signout };

