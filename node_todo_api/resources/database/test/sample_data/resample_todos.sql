use node_todo_test;

INSERT INTO Todo
    (todo_id, title, created_at, completed, user_id)
VALUES
    ('bbe060a5a2c11', 'Sample todo delete', '2023-08-11', false, 'test1'),
    ('6dd1b73fe2845', 'Sample todo toggle', '2023-08-11', false, 'test1'),
    ('15453cf8307d2', 'Sample todo clear', '2023-08-11', true, 'test1');