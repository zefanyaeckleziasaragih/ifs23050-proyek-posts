import apiHelper from "../../../helpers/apiHelper";

const todoApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/todos`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postTodo(title, description) {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data;
  }

  async function postTodoCover(todoId, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name);
    const response = await apiHelper.fetchData(_url(`/${todoId}/cover`), {
      method: "POST",
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  async function putTodo(todoId, title, description, is_finished) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        is_finished,
      }),
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  async function getTodos(is_finished = "") {
    const targetUrl = is_finished ? `/?is_finished=${is_finished}` : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.todos || [];
  }

  async function getTodoById(todoId) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.todo;
  }

  async function deleteTodo(todoId) {
    const response = await apiHelper.fetchData(_url(`/${todoId}`), {
      method: "DELETE",
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  return {
    postTodo,
    postTodoCover,
    putTodo,
    getTodos,
    getTodoById,
    deleteTodo,
  };
})();

export default todoApi;
