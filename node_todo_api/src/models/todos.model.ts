import { QueryError } from 'mysql2';
import { getPool } from '../config/db';

export default interface TodoResource {
  id: string;
  created_at: Date;
  title: string;
  user_id: string;
}

const getAllByUser = (values: string): Promise<TodoResource[]> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'SELECT todo_id as id, created_at, title, completed FROM Todo WHERE user_id = ?;',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        return resolve(rows as TodoResource[]);
      },
    );
  });
};

const insert = (values: (string[] | Date[])[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'INSERT INTO Todo (todo_id, created_at, title, user_id) VALUES (?, ?, ?, ?);',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        return resolve();
      },
    );
  });
};

const remove = (values: string[][]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'SELECT todo_id as id FROM Todo WHERE todo_id = ? AND user_id = ?;',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        if (rows == '' || rows == null || rows.length == 0)
          return reject({ code: 'ER_NOT_FOUND' });
        getPool().query(
          'DELETE FROM Todo WHERE todo_id = ? AND user_id = ?;',
          values,
          (err: QueryError | null, rows: any) => {
            if (err) return reject(err);
            return resolve();
          },
        );
      },
    );
  });
};

const toggleComplete = (values: string[][]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'SELECT todo_id as id FROM Todo WHERE todo_id = ? AND user_id = ?;',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        if (rows == '' || rows == null || rows.length == 0)
          return reject({ code: 'ER_NOT_FOUND' });
        getPool().query(
          'UPDATE Todo SET completed = !completed WHERE todo_id = ? AND user_id = ?;',
          values,
          (err: QueryError | null, rows: any) => {
            if (err) return reject(err);
            return resolve();
          },
        );
      },
    );
  });
};

const clearComplete = (values: string[][]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'DELETE FROM Todo WHERE completed = 1 AND user_id = ?;',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        return resolve();
      },
    );
  });
};

export { clearComplete, getAllByUser, insert, remove, toggleComplete };

