import apiHelper from "../../../helpers/apiHelper";

const postApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/posts`;
  console.log(BASE_URL);
  function _url(path) {
    return BASE_URL + path;
  }

  async function postPost(cover, description) {
    const formData = new FormData();
    if (cover) {
      formData.append("cover", cover, cover.name);
    }
    if (typeof description === "string") {
      formData.append("description", description);
    }
    const response = await apiHelper.fetchData(_url("/"), {
      method: "POST",
      body: formData,
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

  async function putPostDescription(postId, description) {
    console.log(_url(`/${postId}`));
    const response = await apiHelper.fetchData(_url(`/${postId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  async function putPostCover(postId, cover) {
    const formData = new FormData();
    if (cover) {
      formData.append("cover", cover, cover.name);
    }

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

  async function postLike(postId, like) {
    const response = await apiHelper.fetchData(_url(`/${postId}/likes`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like }),
    });
    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }
    return message;
  }

  async function postComment(postId, comment) {
    const response = await apiHelper.fetchData(_url(`/${postId}/comments`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    });
    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }
    return message;
  }

  async function deleteComment(postId, commentId) {
    const response = await apiHelper.fetchData(_url(`/${commentId}/comments`), {
      method: "DELETE",
    });
    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }
    return message;
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
    putPostDescription,
    putPostCover,
    getPosts,
    getPostById,
    postLike,
    postComment,
    deleteComment,
    deletePost,
  };
})();

export default postApi;
