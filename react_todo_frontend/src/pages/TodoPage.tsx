import {
  ClearCompletedTodos,
  CreateTodo,
  DeleteTodo,
  GetTodos,
  ToggleTodoComplete,
} from '@src/apiclient/apiclient';
import NotyfContext from '@src/context/NotyfContext';
import { State } from '@src/models/State';
import { TodoResource } from '@src/models/TodoResource';
import axios, { CancelTokenSource } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './custom.css';

function TodoPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [newTaskValue, setNewTaskValue] = useState<string>('');
  const [todoItems, setTodoItems] = useState<TodoResource[]>(
    [] as TodoResource[],
  );
  const [filteredTodoItems, setFilteredTodoItems] = useState<TodoResource[]>(
    [] as TodoResource[],
  );
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const isLoggedIn = useSelector((state: State) => state.isLoggedIn);
  const apiType = useSelector((state: State) => state.apiType);
  const notyf = useContext(NotyfContext);

  useEffect(() => {
    if (isLoggedIn) {
      let cancelToken = axios.CancelToken.source();
      fetchTodos(cancelToken);
      return () => {
        cancelToken.cancel();
      };
    } else {
      setTodoItems([]);
    }
  }, [isLoggedIn, apiType]);

  useEffect(() => {
    filterTodos(filter);
  }, [filter, todoItems]);

  const fetchTodos = (
    cancelToken: CancelTokenSource | undefined | null = null,
  ) => {
    setIsLoading(true);
    GetTodos(cancelToken).then((response) => {
      setTodoItems(response);
      setIsLoading(false);
    });
  };

  const createItem = (title: string) => {
    if (createLoading || !isLoggedIn || isLoading) return;
    setCreateLoading(true);
    CreateTodo({ title: title } as TodoResource).then((response) => {
      todoItems.push(response);
      setNewTaskValue('');
      setCreateLoading(false);
      notyf.success('Todo created!');
    });
  };

  const markComplete = (id: string) => {
    var currentCompleteValue =
      todoItems.find((item) => item.id === id)?.completed ?? false;
    setTodoItems(
      todoItems.map((item) => {
        if (item.id === id) {
          item.completed = !currentCompleteValue;
        }
        return item;
      }),
    );

    ToggleTodoComplete(id).catch((ex) => {
      // Revert completed flag back, as we had an error
      setTodoItems(
        todoItems.map((item) => {
          if (item.id === id) {
            item.completed = currentCompleteValue;
          }
          return item;
        }),
      );
    });
  };

  const removeItem = (id: string) => {
    var originalTodo = todoItems.filter((item) => item.id === id)[0];
    setTodoItems(todoItems.filter((item) => item.id !== id));

    DeleteTodo(id).catch((ex) => {
      // Revert todo list back, as we had an error
      var newTodos = todoItems;
      newTodos.push(originalTodo);
      setTodoItems(newTodos);
    });
  };

  const filterTodos = (filter: 'all' | 'active' | 'completed' = 'all') => {
    setFilter(filter);
    switch (filter) {
      case 'active':
        setFilteredTodoItems(todoItems.filter((item) => !item.completed));
        break;
      case 'completed':
        setFilteredTodoItems(todoItems.filter((item) => item.completed));
        break;
      default:
        setFilteredTodoItems(todoItems);
    }
  };

  const clearComplete = () => {
    var todosToClear = todoItems.filter((item) => item.completed);
    setTodoItems(todoItems.filter((item) => !item.completed));
    ClearCompletedTodos()
      .then(() => {
        notyf.success('Completed todos cleared!');
      })
      .catch(() => {
        var seen: { [name: string]: boolean } = {};
        var newTodoItems = todoItems.concat(todosToClear);
        newTodoItems = newTodoItems.filter(function (item) {
          return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
        });
        setTodoItems(newTodoItems);
      });
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      createItem(newTaskValue);
    }
  };

  return (
    <Container
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Card style={{ width: '50%', padding: '2rem', marginTop: '2rem' }}>
        <div className='header'>
          <h1 className='todo-title'>To Do List</h1>
          <div className='new-todo-container' style={{ display: 'flex' }}>
            <input
              value={newTaskValue}
              className='new-todo'
              placeholder='What needs to be done?'
              onChange={(event) => setNewTaskValue(event?.target.value)}
              onKeyDown={handleKeyDown}
            />
            {createLoading && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Spinner variant='primary' size='sm'></Spinner>
              </div>
            )}
          </div>
        </div>
        <div className='todo-container'>
          {!isLoggedIn ? (
            <p style={{ marginTop: '1rem' }}>
              Sign in to use the todo list feature! click the button on the top
              right.
            </p>
          ) : isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}>
              <Spinner variant='primary'></Spinner>
            </div>
          ) : (
            <>
              <ul className='todo-list'>
                {filteredTodoItems?.map((todoItem: TodoResource) => {
                  return (
                    <li
                      key={todoItem.id}
                      className={`todo-item ${
                        todoItem.completed ? 'completed' : ''
                      }`}>
                      <div className='list-item'>
                        <input
                          className='check'
                          type='checkbox'
                          defaultChecked={todoItem.completed ?? false}
                          onClick={() => markComplete(todoItem.id)}
                        />
                        <label className='title'>{todoItem.title}</label>
                        <button
                          className='remove'
                          onClick={() => removeItem(todoItem.id)}></button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className='footer'>
                <div className='remaining'>
                  <strong>
                    {todoItems.filter((todo) => !todo.completed).length}
                  </strong>
                  &nbsp;items left
                </div>
                <ul className='filters'>
                  <li>
                    <a
                      className={`${filter == 'all' ? 'selected' : ''}`}
                      onClick={() => filterTodos('all')}>
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      className={`${filter == 'active' ? 'selected' : ''}`}
                      onClick={() => filterTodos('active')}>
                      Active
                    </a>
                  </li>
                  <li>
                    <a
                      className={`${filter == 'completed' ? 'selected' : ''}`}
                      onClick={() => filterTodos('completed')}>
                      Completed
                    </a>
                  </li>
                </ul>
                <div className='clear-complete'>
                  <a onClick={clearComplete}>Clear completed</a>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </Container>
  );
}

export default TodoPage;
