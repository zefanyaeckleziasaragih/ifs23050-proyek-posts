import apiHelper from "../../../helpers/apiHelper";

const postApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/todos`;
  console.log(BASE_URL);
  function _url(path) {
    return BASE_URL + path;
  }

  async function postPost(title, description) {
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

  async function postPostCover(postId, cover) {
    const formData = new FormData();
    formData.append("cover", cover, cover.name);
    const response = await apiHelper.fetchData(_url(`/${postId}/cover`), {
      method: "POST",
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  async function putPost(postId, title, description, is_finished) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
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

  async function getPosts(is_finished = "") {
    const targetUrl = is_finished ? `/?is_finished=${is_finished}` : "/";

    const response = await apiHelper.fetchData(_url(targetUrl), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.posts || [];
  }

  async function getPostById(postId) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.post;
  }

  async function deletePost(postId) {
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "DELETE",
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  return {
    postPost,
    postPostCover,
    putPost,
    getPosts,
    getPostById,
    deletePost,
  };
})();

export default postApi;
