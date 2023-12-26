import { QueryError } from 'mysql2';
import { getPool } from '../config/db';

export default interface SessionResource {
  session_token: string;
  created_at: Date;
  user_id: string;
}

const insert = (values: (string[] | Date[])[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'INSERT INTO Session (session_token, created_at, user_id) VALUES (?, ?, ?);',
      values,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        return resolve();
      },
    );
  });
};

const getByToken = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    getPool().query(
      'SELECT user_id FROM Session WHERE session_token = ? LIMIT 1',
      token,
      (err: QueryError | null, rows: any) => {
        if (err) return reject(err);
        if (rows == '' || rows == null || rows.length == 0) return reject(null);
        return resolve(rows[0].user_id as string);
      },
    );
  });
};

export { getByToken, insert };
