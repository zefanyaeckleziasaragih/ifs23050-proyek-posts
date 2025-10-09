// DetailPage.jsx
import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  asyncSetPost,
  setIsPostActionCreator,
  asyncPostComment,
  asyncDeleteComment,
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";

function DetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showChangeCoverModal, setShowChangeCoverModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Ambil data dari reducer
  const profile = useSelector((state) => state.profile);
  const post = useSelector((state) => state.post);
  const isPost = useSelector((state) => state.isPost);

  // 1. Ambil data post sesuai postId
  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId, dispatch]);

  // Periksa apakah pengabilan data post sudah selesai
  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        // Navigasi ke home jika post tidak ditemukan
        navigate("/");
      }
    }
  }, [isPost, post, navigate, dispatch]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Logic Post Comment UTUH
      dispatch(asyncPostComment(postId, profile.name + ": " + newComment));

      // Refresh post data to get updated comments
      // Tunggu sebentar sebelum refresh untuk memberi waktu API
      setTimeout(() => {
        dispatch(asyncSetPost(postId));
      }, 500);

      // Clear the input
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = showConfirmDialog(
      "Apakah Anda yakin ingin menghapus komentar ini?"
    );

    confirmDelete.then((result) => {
      if (result.isConfirmed) {
        try {
          // Logic Delete Comment UTUH
          dispatch(asyncDeleteComment(postId, commentId));

          // Refresh post data to get updated comments
          setTimeout(() => {
            dispatch(asyncSetPost(postId));
          }, 500);
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      }
    });
  };

  if (!profile || !post) return;

  // Variabel untuk mengecek apakah user saat ini adalah pemilik post
  const isPostOwner =
    String(post.created_by) === String(profile.id) ||
    String(post.author?.id) === String(profile.id) ||
    String(post.user_id) === String(profile.id);

  return (
    <>
      {/* Style CSS untuk tombol/input yang lebih keren */}
      <style>
        {`
          .gradient-button {
            background: linear-gradient(45deg, #f5576c 0%, #f093fb 100%);
            border: none;
            color: white;
            transition: all 0.3s ease;
          }
          .gradient-button:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(245, 87, 108, 0.4);
            color: white;
          }
          .custom-input:focus {
            border-color: #f5576c;
            box-shadow: 0 0 0 0.25rem rgba(245, 87, 108, 0.25);
          }
          .hover-scale:hover {
            transform: scale(1.01);
            transition: all 0.2s ease;
          }
        `}
      </style>

      {/* */}
      <div
        className="main-content"
        style={{
          background: "linear-gradient(180deg, #fdfbfb 0%, #ebedee 100%)",
          minHeight: "calc(100vh - 56px)",
          padding: "20px 0",
          // SOLUSI: Tambahkan padding-top di sini untuk memberi ruang pada fixed Navbar
          paddingTop: "90px",
        }}
      >
        <div
          className="container-fluid"
          style={{ maxWidth: 800, margin: "0 auto", padding: "0 15px" }}
        >
          {/* Header Postingan */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0" style={{ color: "#333", fontWeight: 700 }}>
              Detail Postingan
            </h2>
          </div>

          {/* Garis pemisah aesthetic */}
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #f093fb, #f5576c, #ffd140)",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          />

          {/* Kartu Postingan Utama */}
          <div
            className="card mb-5 hover-scale"
            style={{
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
          >
            {post.cover ? (
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <img
                  width="100%"
                  src={post.cover}
                  alt="Cover Post"
                  style={{
                    maxHeight: "400px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Tombol Ganti Cover (Hanya untuk pemilik) */}
                {isPostOwner && (
                  <button
                    className="btn btn-sm text-white"
                    style={{
                      position: "absolute",
                      top: 15,
                      right: 15,
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: 10,
                    }}
                    onClick={() => setShowChangeCoverModal(true)}
                  >
                    <i className="bi bi-image"></i> Ganti Cover
                  </button>
                )}
              </div>
            ) : (
              isPostOwner && (
                // Tombol Tambah Cover jika belum ada
                <div
                  className="p-4 bg-light text-center"
                  style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
                >
                  <button
                    className="btn gradient-button"
                    onClick={() => setShowChangeCoverModal(true)}
                    style={{ borderRadius: 12, padding: "10px 20px" }}
                  >
                    <i className="bi bi-image"></i> Tambah Cover Postingan
                  </button>
                </div>
              )
            )}

            <div className="card-body p-4 p-md-5">
              <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#555" }}>
                {post.description}
              </p>

              <div className="mt-4 pt-3 border-top">
                <small className="text-muted d-block">
                  Dibuat oleh:{" "}
                  <span style={{ fontWeight: 600, color: "#f5576c" }}>
                    {post.user?.name || post.author?.name || "Pengguna"}
                  </span>
                </small>
                <small className="text-muted">
                  Dipublikasi pada: {formatDate(post.created_at || new Date())}
                </small>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div
            className="card mb-4"
            style={{
              borderRadius: 20,
              boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid #eee",
            }}
          >
            <div
              className="card-header fw-bold border-bottom-0 p-4"
              style={{
                backgroundColor: "transparent",
                borderBottom: "none",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              <i
                className="bi bi-chat-dots-fill me-2"
                style={{ color: "#f5576c" }}
              ></i>
              {post.comments?.length || 0} Komentar
            </div>

            {/* List Komentar */}
            <div
              className="list-group list-group-flush"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {!post.comments || post.comments.length === 0 ? (
                <div className="p-4 text-center text-muted">
                  <i
                    className="bi bi-chat-left-text"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p className="mb-0">Belum ada komentar.</p>
                </div>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="list-group-item"
                    style={{
                      padding: "15px 20px",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1 me-3">
                        {/* JANGAN GANGGU KOMENTAR - Tetap tampilkan teks komentar yang sudah mengandung nama pengguna */}
                        <p
                          className="mb-1"
                          style={{ fontWeight: 500, color: "#222" }}
                        >
                          {comment.comment}
                        </p>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {formatDate(comment.created_at)}
                        </small>
                      </div>

                      {/* Tombol Delete (Pertahankan Fungsionalitas) */}
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ borderRadius: 8 }}
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
          <div
            className="card mb-4"
            style={{
              borderRadius: 15,
              boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
              border: "none",
            }}
          >
            <div className="card-body p-4">
              <form onSubmit={handleSubmitComment}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control custom-input"
                    placeholder={`Komentar sebagai ${
                      profile.name || "Anda"
                    }...`}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    style={{
                      padding: "12px 15px",
                      borderRadius: "12px 0 0 12px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn gradient-button"
                    style={{
                      borderRadius: "0 12px 12px 0",
                      padding: "12px 20px",
                    }}
                  >
                    <i className="bi bi-send-fill me-1"></i> Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ChangeCoverModal
        show={showChangeCoverModal}
        onClose={() => setShowChangeCoverModal(false)}
        post={post}
      />
    </>
  );
}

export default DetailPage;
