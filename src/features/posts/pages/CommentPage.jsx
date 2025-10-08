// src/features/posts/pages/CommentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Sesuaikan path import apiHelper jika perlu
// import postApi from "../../../api/postApi";
import { formatDate } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetPost,
  asyncPostComment,
  asyncDeleteComment,
} from "../states/action";

function CommentPage() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useSelector((state) => state.post);
  const [comments, setComments] = useState([]); // Array kosong, tidak ada komentar awal
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  console.log("Rendering CommentPage for postId:", postId);

  // 1. Ambil data post sesuai postId
  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId]);

  console.log("Post data from Redux:", post);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // --- LOGIKA FETCH DATA POST DAN KOMENTAR (PERLU IMPLEMENTASI API NYATA) ---
        // Asumsi sementara: Anda akan fetch detail post.
        // const fetchedPost = await postApi.getPostById(postId);
        // const fetchedComments = await commentApi.getCommentsByPostId(postId); // Anda harus membuat commentApi
        // PLACEHOLDER DATA POST:
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // --- LOGIKA POST KOMENTAR KE API (PERLU IMPLEMENTASI API NYATA) ---

    dispatch(asyncPostComment(postId, newComment));

    // PLACEHOLDER: Tambahkan komentar baru secara lokal (INI HARUS TETAP ADA)
    const newCommentData = {
      id: Date.now(),
      username: "Anda", // Gunakan profile.username dari Redux jika tersedia
      content: newComment,
      created_at: Date.now(),
    };

    setComments((prev) => [...prev, newCommentData]);
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    // --- LOGIKA DELETE KOMENTAR DARI API (PERLU IMPLEMENTASI API NYATA) ---
    dispatch(asyncDeleteComment(postId, commentId));

    // PLACEHOLDER: Hapus komentar secara lokal (INI HARUS TETAP ADA)
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  if (loading) {
    return <div className="mt-5 text-center">Memuat Komentar...</div>;
  }

  if (!post) {
    return <div className="mt-5 text-center">Post tidak ditemukan.</div>;
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

      {/* Daftar Komentar */}
      <div className="card mb-4 col-lg-6 mx-auto">
        <div className="card-header fw-bold">
          {post.comments.length} Komentar
        </div>
        <div
          className="list-group list-group-flush"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          {post.comments.length === 0 ? (
            <div className="p-3 text-center text-muted">
              Belum ada komentar.
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <p className="mb-1">
                      {/* <strong className="me-2">{comment.username}:</strong> */}
                      {comment.comment}
                    </p>
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

      {/* Input Komentar Baru */}
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
