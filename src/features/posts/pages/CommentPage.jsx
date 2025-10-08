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

  console.log("Rendering CommentPage for postId:", postId);

  // 1. Ambil data post sesuai postId
  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId]);

  // 2. Periksa apakah pengambilan data post sudah selesai
  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        navigate("/");
      }
    }
  }, [isPost, post, navigate]);

  console.log("Post data from Redux:", post);
  console.log("Post keys:", post ? Object.keys(post) : "No post data");
  console.log("Post comments property:", post?.comments);


  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Post comment to API
      await dispatch(asyncPostComment(postId, newComment));
      
      // Refresh post data to get updated comments
      dispatch(asyncSetPost(postId));
      
      // Clear the input
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      console.log("Menghapus komen dengan id:", commentId);
      
      // Delete comment from API
      await dispatch(asyncDeleteComment(postId, commentId));
      
      // Refresh post data to get updated comments
      dispatch(asyncSetPost(postId));
      
      console.log("Berhasil menghapus komen:", commentId);
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

      {/* Daftar Komentar */}
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
