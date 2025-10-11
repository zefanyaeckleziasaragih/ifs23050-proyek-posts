import apiHelper from "../../../helpers/apiHelper";

const postApi = (() => {
  const BASE_URL = `${import.meta.env.VITE_DELCOM_BASEURL}/posts`;
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

  async function deleteComment(postId) {
    const response = await apiHelper.fetchData(_url(`/${[postId]}/comments`), {
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

/*
 * Dokumentasi Kode
 *
 * postApi adalah modul yang menyediakan fungsi-fungsi untuk berinteraksi dengan API
 * yang berhubungan dengan entitas 'posts' (kiriman/pos).
 * Modul ini menggunakan pola IIFE (Immediately Invoked Function Expression)
 * untuk mengisolasi cakupan dan mengembalikan objek dengan fungsi-fungsi publik.
 *
 * Dependencies:
 * - apiHelper: Sebuah helper untuk melakukan permintaan fetch ke API.
 *
 * Konstanta:
 * - BASE_URL: URL dasar untuk endpoint post, diambil dari variabel lingkungan.
 *
 * Fungsi Privat:
 * - _url(path): Menggabungkan BASE_URL dengan path yang diberikan untuk membentuk URL lengkap.
 *
 * Fungsi Publik (API Endpoints):
 *
 * 1. postPost(cover, description)
 * - Melakukan permintaan POST untuk membuat kiriman baru.
 * - Menerima `cover` (File objek) dan `description` (string).
 * - Menggunakan `FormData` karena mungkin menyertakan file.
 * - Endpoint: POST /posts/
 * - Mengembalikan data kiriman yang baru dibuat.
 *
 * 2. postPostCover(postId, cover)
 * - Melakukan permintaan POST untuk mengunggah cover (gambar) untuk kiriman yang sudah ada.
 * - Menerima `postId` (ID kiriman) dan `cover` (File objek).
 * - Menggunakan `FormData`.
 * - Endpoint: POST /posts/{postId}/cover
 * - Mengembalikan pesan sukses.
 *
 * 3. putPostDescription(postId, description)
 * - Melakukan permintaan PUT untuk memperbarui deskripsi kiriman.
 * - Menerima `postId` (ID kiriman) dan `description` (string).
 * - Menggunakan header "Content-Type": "application/json".
 * - Endpoint: PUT /posts/{postId}
 * - Mengembalikan pesan sukses.
 *
 * 4. putPostCover(postId, cover)
 * - Melakukan permintaan POST untuk memperbarui cover (gambar) kiriman.
 * - Menerima `postId` (ID kiriman) dan `cover` (File objek).
 * - Menggunakan `FormData`.
 * - Endpoint: POST /posts/{postId}/cover (Catatan: Ini menggunakan POST untuk update cover, mungkin sesuai dengan desain backend)
 * - Mengembalikan pesan sukses.
 *
 * 5. getPosts(is_finished = "")
 * - Melakukan permintaan GET untuk mengambil daftar kiriman.
 * - Menerima parameter opsional `is_finished` (string) untuk filter.
 * - Endpoint: GET /posts/ atau GET /posts/?is_finished={is_finished}
 * - Mengembalikan array kiriman.
 *
 * 6. getPostById(postId)
 * - Melakukan permintaan GET untuk mengambil detail satu kiriman berdasarkan ID.
 * - Menerima `postId` (ID kiriman).
 * - Endpoint: GET /posts/{postId}
 * - Mengembalikan objek kiriman.
 *
 * 7. postLike(postId, like)
 * - Melakukan permintaan POST untuk memberi atau menghapus 'like' (suka) pada kiriman.
 * - Menerima `postId` (ID kiriman) dan `like` (boolean).
 * - Endpoint: POST /posts/{postId}/likes
 * - Mengembalikan pesan sukses.
 *
 * 8. postComment(postId, comment)
 * - Melakukan permintaan POST untuk menambahkan komentar pada kiriman.
 * - Menerima `postId` (ID kiriman) dan `comment` (string).
 * - Endpoint: POST /posts/{postId}/comments
 * - Mengembalikan pesan sukses.
 *
 * 9. deleteComment(postId)
 * - Melakukan permintaan DELETE untuk menghapus komentar.
 * - Catatan: Fungsi ini menerima `postId` tetapi endpoint menggunakan array `[postId]`
 * yang mungkin merupakan kesalahan ketik dalam URL konstruksi di fungsi aslinya,
 * atau merupakan desain backend spesifik.
 * - Endpoint: DELETE /posts/{[postId]}/comments
 * - Mengembalikan pesan sukses.
 *
 * 10. deletePost(postId)
 * - Melakukan permintaan DELETE untuk menghapus kiriman.
 * - Menerima `postId` (ID kiriman).
 * - Endpoint: DELETE /posts/{postId}
 * - Mengembalikan pesan sukses.
 *
 * Penanganan Kesalahan:
 * - Setiap fungsi melakukan parsing respons JSON dan memeriksa properti `success`.
 * - Jika `success` adalah `false`, fungsi akan melemparkan `Error` dengan `message` dari respons API.
 */
