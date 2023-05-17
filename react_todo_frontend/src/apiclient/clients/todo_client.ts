import { AxiosResponse, CancelTokenSource } from 'axios';
import { default as axios } from '../../interceptors/axiosCoreInterceptor';
import { TodoResource } from '../../models/TodoResource';

export const GetTodos = async (
  cancelToken: CancelTokenSource | undefined | null = null,
): Promise<TodoResource[]> => {
  const endpoint = '/todo';
  try {
    var result = await axios.get<TodoResource[], AxiosResponse<TodoResource[]>>(
      endpoint,
      {
        cancelToken: cancelToken?.token,
      },
    );
    return Promise.resolve(result.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const CreateTodo = async (
  data: TodoResource,
  cancelToken: CancelTokenSource | undefined | null = null,
): Promise<TodoResource> => {
  const endpoint = '/todo';
  try {
    var result = await axios.post<TodoResource, AxiosResponse<TodoResource>>(
      endpoint,
      data,
      { cancelToken: cancelToken?.token },
    );
    return Promise.resolve(result.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const ToggleTodoComplete = async (
  todoId: string,
  cancelToken: CancelTokenSource | undefined | null = null,
) => {
  const endpoint = '/todo/togglecomplete/' + todoId;
  try {
    await axios.post<TodoResource, AxiosResponse<TodoResource>>(
      endpoint,
      null,
      {
        cancelToken: cancelToken?.token,
      },
    );
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const DeleteTodo = async (
  todoId: string,
  cancelToken: CancelTokenSource | undefined | null = null,
) => {
  const endpoint = '/todo/' + todoId;
  try {
    await axios.delete<TodoResource, AxiosResponse<TodoResource>>(endpoint, {
      cancelToken: cancelToken?.token,
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export const ClearCompletedTodos = async (
  cancelToken: CancelTokenSource | undefined | null = null,
) => {
  const endpoint = '/todo/clearcompleted';
  try {
    await axios.post<TodoResource, AxiosResponse<TodoResource>>(endpoint, {
      cancelToken: cancelToken?.token,
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
