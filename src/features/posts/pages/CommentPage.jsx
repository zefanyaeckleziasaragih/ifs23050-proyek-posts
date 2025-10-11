import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDate } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetPost,
  asyncPostComment,
  asyncDeleteComment,
  setIsPostActionCreator,
} from "../states/action";

function CommentPage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useSelector((state) => state.post);
  const isPost = useSelector((state) => state.isPost);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId]);

  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        navigate("/");
      }
    }
  }, [isPost, post, navigate]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await dispatch(asyncPostComment(postId, newComment));

      dispatch(asyncSetPost(postId));

      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await dispatch(asyncDeleteComment(postId, commentId));

      dispatch(asyncSetPost(postId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!post) {
    return <div className="mt-5 text-center">Memuat Komentar...</div>;
  }

  return (
    <div className="container-fluid mt-3">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm btn-link mb-3 text-decoration-none"
      >
        <i className="bi bi-arrow-left"></i> Kembali ke Beranda
      </button>

      <h3>Komentar Post {postId}</h3>
      <hr />

      <div className="card mb-4 col-lg-6 mx-auto">
        <div className="card-header fw-bold">
          {post.comments?.length || 0} Komentar
        </div>
        <div
          className="list-group list-group-flush"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {!post.comments || post.comments.length === 0 ? (
            <div className="p-3 text-center text-muted">
              Belum ada komentar.
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <p className="mb-1">{comment.comment}</p>
                    <small className="text-muted">
                      {formatDate(comment.created_at)}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-danger ms-2"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card col-lg-6 mx-auto">
        <div className="card-body">
          <form onSubmit={handleSubmitComment}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tambahkan komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentPage;

/*
 * Dokumentasi Kode
 *
 * CommentPage adalah komponen halaman yang menampilkan detail komentar untuk post tertentu dan memungkinkan pengguna untuk menambahkan atau menghapus komentar.
 *
 * Dependencies:
 * - useParams, useNavigate dari "react-router-dom": Untuk mengakses parameter rute (`postId`) dan navigasi.
 * - useEffect, useState dari "react": Hook standar React.
 * - formatDate: Helper untuk memformat tanggal dan waktu.
 * - useDispatch, useSelector dari "react-redux": Untuk interaksi dengan Redux store.
 * - asyncSetPost, asyncPostComment, asyncDeleteComment, setIsPostActionCreator: Action Redux untuk mengelola data post dan komentar.
 *
 * State:
 * - Redux State:
 * - profile: Data profil pengguna yang sedang login.
 * - post: Objek post yang sedang dilihat, termasuk daftar komentarnya.
 * - isPost: Boolean, flag yang menunjukkan status proses pengambilan data post.
 * - Local State:
 * - newComment: String, menyimpan input komentar baru dari pengguna.
 *
 * Lifecycle Hooks (useEffect):
 *
 * 1. Pemuatan Post (Dependensi: `[postId]`):
 * - Dijalankan saat komponen dimuat atau ketika `postId` berubah.
 * - Mendispatch `asyncSetPost(postId)` untuk mengambil data post spesifik dari API dan menyimpannya ke Redux store.
 *
 * 2. Validasi Post dan Navigasi (Dependensi: `[isPost, post, navigate]`):
 * - Dijalankan setelah status `isPost` (status pengambilan post) berubah menjadi true.
 * - Mengatur ulang `isPost` di Redux menjadi false.
 * - Jika data `post` tidak ditemukan (null/undefined), pengguna diarahkan kembali ke halaman beranda (`/`).
 *
 * Fungsi handleSubmitComment(e):
 * - Menangani pengiriman form komentar baru.
 * - Mencegah aksi default form (`e.preventDefault()`).
 * - Memastikan input komentar tidak kosong.
 * - Mendispatch `asyncPostComment` untuk mengirim komentar baru ke API.
 * - Setelah berhasil, mendispatch `asyncSetPost` lagi untuk memuat ulang data post (termasuk komentar baru) dan memperbarui tampilan.
 * - Mengosongkan input `newComment`.
 *
 * Fungsi handleDeleteComment(commentId):
 * - Menangani permintaan penghapusan komentar.
 * - Mendispatch `asyncDeleteComment` dengan `postId` dan `commentId`.
 * - Setelah berhasil, mendispatch `asyncSetPost` untuk memuat ulang data post (komentar yang dihapus akan hilang) dan memperbarui tampilan.
 *
 * Rendering:
 * - Menampilkan pesan "Memuat Komentar..." jika `post` belum dimuat.
 * - Menampilkan tombol "Kembali ke Beranda" yang menggunakan `Maps(-1)`.
 * - Bagian Daftar Komentar: Menampilkan jumlah komentar dan mengulang (map) daftar `post.comments`. Setiap komentar ditampilkan bersama tanggal formatnya, dan memiliki tombol "Hapus" yang memanggil `handleDeleteComment`. Daftar ini memiliki batas tinggi (`maxHeight`) dan scrollbar.
 * - Bagian Input Komentar Baru: Formulir dengan `input-group` untuk memasukkan komentar baru, dikendalikan oleh state `newComment`, dan memanggil `handleSubmitComment` saat dikirim.
 */
