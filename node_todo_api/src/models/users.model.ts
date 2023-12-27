import { QueryError } from 'mysql2';
import { getPool } from '../config/db';

export default interface UserResource {
  username: string;
  password: string;
}

const getByUsernameAndPassword = (
  values: string[][],
): Promise<UserResource[]> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'SELECT * FROM User WHERE username = ? AND password = ? LIMIT 1;',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        if (rows == '' || rows == null || rows.length == 0) return reject(null);
        return resolve(rows as UserResource[]);
      },
    );
  });
};

const insert = (values: string[][]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'INSERT INTO User (username, password) VALUES (?, ?);',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        return resolve();
      },
    );
  });
};

const signout = (values: string[][]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'DELETE FROM Session WHERE session_token = ?;',
      values,
      (err: QueryError | null, rows: any) => {
        console.log(err);
        if (err) return reject(err);
        return resolve();
      },
    );
  });
};

export { getByUsernameAndPassword, insert, signout };
