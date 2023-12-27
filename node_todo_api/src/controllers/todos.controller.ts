import crypto from 'crypto';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getByToken } from '../models/sessions.model';
import {
  clearComplete as todo_clearComplete,
  insert as todo_insert,
  getAllByUser as todo_list,
  remove as todo_remove,
  toggleComplete as todo_toggleComplete,
} from '../models/todos.model';

const list = async (req: Request, res: Response) => {
  let hashedToken = crypto
    .createHash('sha512')
    .update(req.header('Authorization') as string)
    .digest('hex');
  var user_id = await getByToken(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need

  todo_list(user_id)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};

const create = async (req: Request, res: Response) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ errors: validation.array() });
  }

  let hashedToken = crypto
    .createHash('sha512')
    .update(req.header('Authorization') as string)
    .digest('hex');
  var user_id = await getByToken(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need

  let todo_values = [
    [Math.random().toString(16).substring(2, 32)],
    [new Date()],
    [req.body.title],
    [user_id],
  ];
  todo_insert(todo_values)
    .then(() => {
      return res.status(200).json({ id: todo_values[0][0], created_at: todo_values[1][0], title: todo_values[2][0] });
    })
    .catch((err) => {
      return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};

const remove = async (req: Request, res: Response) => {
  let todo_id = req.params.id;
  let hashedToken = crypto
    .createHash('sha512')
    .update(req.header('Authorization') as string)
    .digest('hex');
  var user_id = await getByToken(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need

  let values = [[todo_id], [user_id]];
  todo_remove(values)
    .then(() => {
      return res.status(204).json();
    })
    .catch((err) => {
      if (err.code == 'ER_NOT_FOUND')
        return res.status(404).json({ status: 404, message: 'Todo not found' });
      return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};

const toggleComplete = async (req: Request, res: Response) => {
  let todo_id = req.params.id;
  let hashedToken = crypto
    .createHash('sha512')
    .update(req.header('Authorization') as string)
    .digest('hex');
  var user_id = await getByToken(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need

  let values = [[todo_id], [user_id]];
  todo_toggleComplete(values)
    .then(() => {
      return res.status(204).json();
    })
    .catch((err) => {
      if (err.code == 'ER_NOT_FOUND')
        return res.status(404).json({ status: 404, message: 'Todo not found' });
      return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};

const clearComplete = async (req: Request, res: Response) => {
  let hashedToken = crypto
    .createHash('sha512')
    .update(req.header('Authorization') as string)
    .digest('hex');
  var user_id = await getByToken(hashedToken); // Auth middleware handles check for me, so we can assume this passes with the data we need

  let values = [[user_id]];
  todo_clearComplete(values)
    .then(() => {
      return res.status(204).json();
    })
    .catch((err) => {
      return res.status(500).json({ status: 500, message: err?.code ?? err });
    });
};

export { clearComplete, create, list, remove, toggleComplete };

