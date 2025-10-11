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
  // ⭐️ Tambahkan asyncChangeCoverPost jika fitur Change Cover memiliki action tersendiri
  // Jika tidak ada, pastikan modal ChangeCoverModal memanggil action yang benar.
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";

function DetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showChangeCoverModal, setShowChangeCoverModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [fadeIn, setFadeIn] = useState(false);

  // Ambil data dari reducer
  const profile = useSelector((state) => state.profile);
  const post = useSelector((state) => state.post);
  const isPost = useSelector((state) => state.isPost);

  // Efek Fade In
  useEffect(() => {
    setFadeIn(true);
  }, []);

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

  // Konstanta Warna dan Estetika dari HomePage
  const PRIMARY_COLOR = "#667eea"; // Ungu Muda
  const SECONDARY_COLOR = "#764ba2"; // Ungu Tua
  const ACCENT_COLOR = "#f58529"; // Oranye (dari gradient tombol Home)
  const GRADIENT_BG =
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"; // Gradien Penuh dari HomePage

  // ⭐️ FUNGSI BARU/PERBAIKAN: Untuk menutup modal dan me-refresh data
  const handleCoverModalClose = (coverUpdated) => {
    setShowChangeCoverModal(false);
    // Hanya refresh jika update cover berhasil (diasumsikan ChangeCoverModal
    // memberikan sinyal melalui argumen 'coverUpdated' yang bernilai true)
    if (coverUpdated) {
      // Panggil asyncSetPost untuk mengambil data post terbaru dari API
      // Menunda sebentar untuk memastikan modal sudah tertutup dan API selesai
      setTimeout(() => {
        dispatch(asyncSetPost(postId));
      }, 300); // Penundaan lebih singkat (300ms) untuk respons yang lebih cepat
    }
  };

  return (
    <>
      {/* Style CSS Konsisten dengan HomePage */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes floatAnimation { /* Tambah animasi float dari HomePage */
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-5px) scale(1.01); }
          }
          .gradient-button {
            background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #dd2a7b 100%);
            border: none;
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          .gradient-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(245, 133, 41, 0.4);
            color: white;
          }
          .custom-input:focus {
            border-color: ${PRIMARY_COLOR} !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25) !important;
            transform: translateY(-1px);
            transition: all 0.3s ease;
          }
          .hover-scale-detail { /* Ubah nama class agar tidak menimpa */
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hover-scale-detail:hover {
            transform: scale(1.005) translateY(-3px) !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
          }
          .post-content-container { /* Style baru untuk kontainer tengah */
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.2);
          }
        `}
      </style>

      {/* Kontainer Utama dengan Full Screen Background Gradien dari HomePage */}
      <div
        style={{
          minHeight: "100vh",
          padding: 0,
          background: GRADIENT_BG, // Menggunakan BG Gradien Penuh
          transition: "opacity 0.6s ease",
          opacity: fadeIn ? 1 : 0,
          paddingTop: "90px", // Ruang untuk fixed Navbar
        }}
      >
        {/* Animated Background Circles (Dibuat Mirip HomePage) */}
        <div
          style={{
            position: "fixed",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            top: "-100px",
            right: "-100px",
            pointerEvents: "none",
            zIndex: 1,
            animation: "floatAnimation 8s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "fixed",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            bottom: "-80px",
            left: "-80px",
            pointerEvents: "none",
            zIndex: 1,
            animation: "floatAnimation 6s ease-in-out infinite",
          }}
        />

        {/* Main Content Container dengan Background Putih Transparan */}
        <div
          className="main-content"
          style={{ position: "relative", zIndex: 10, paddingBottom: "40px" }}
        >
          <div
            className="container-fluid"
            style={{ maxWidth: 800, margin: "0 auto", padding: "0 15px" }}
          >
            {/* Header Postingan */}
            <div
              className="d-flex justify-content-between align-items-center mb-4"
              style={{ animation: "fadeInUp 0.6s ease-out" }}
            >
              <h1
                className="mb-0 text-white"
                style={{
                  fontWeight: 800,
                  fontSize: "2.5rem",
                  textShadow: "0 2px 5px rgba(0,0,0,0.4)",
                }}
              >
                <i
                  className="bi bi-card-heading me-3"
                  // ✅ PERBAIKAN: Ganti warna ikon menjadi putih
                  style={{ color: "#FFFFFF" }}
                ></i>
                Detail Postingan
              </h1>
            </div>
            {/* Garis pemisah aesthetic */}
            <div
              style={{
                height: "4px",
                // ✅ PERBAIKAN: Ganti warna gradien garis menjadi Putih ke Transparan/Putih
                background: `linear-gradient(90deg, #FFFFFF, rgba(255, 255, 255, 0.5))`,
                borderRadius: "5px",
                marginBottom: "30px",
                animation: "fadeInUp 0.6s ease-out 0.1s backwards",
              }}
            />
            <div className="post-content-container">
              {/* Kartu Postingan Utama */}
              <div
                className="card mb-5 hover-scale-detail"
                style={{
                  borderRadius: 24,
                  boxShadow: "0 15px 45px rgba(0, 0, 0, 0.12)",
                  border: "1px solid #e0e0e0",
                  animation: "fadeInUp 0.6s ease-out 0.2s backwards",
                }}
              >
                {post.cover ? (
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderTopLeftRadius: 24,
                      borderTopRightRadius: 24,
                    }}
                  >
                    <img
                      width="100%"
                      src={post.cover}
                      alt="Cover Post"
                      style={{
                        maxHeight: "450px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* Tombol Ganti Cover (Hanya untuk pemilik) */}
                    {isPostOwner && (
                      <button
                        className="btn btn-sm text-white gradient-button"
                        style={{
                          position: "absolute",
                          top: 20,
                          right: 20,
                          background: "rgba(0,0,0,0.6)",
                          borderRadius: 12,
                          padding: "8px 15px",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
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
                      style={{
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <button
                        className="btn gradient-button"
                        onClick={() => setShowChangeCoverModal(true)}
                        style={{ borderRadius: 12, padding: "12px 25px" }}
                      >
                        <i className="bi bi-image me-2"></i> Tambah Cover
                        Postingan
                      </button>
                    </div>
                  )
                )}

                <div className="card-body p-4 p-md-5">
                  <p
                    style={{
                      fontSize: "1.1rem",
                      lineHeight: 1.7,
                      color: "#444",
                    }}
                  >
                    {post.description}
                  </p>

                  <div className="mt-4 pt-4 border-top">
                    <small className="text-muted d-block mb-1">
                      Dibuat oleh:{" "}
                      <span style={{ fontWeight: 700, color: SECONDARY_COLOR }}>
                        {post.user?.name || post.author?.name || "Pengguna"}
                      </span>
                    </small>
                    <small
                      className="text-muted"
                      style={{ fontSize: "0.9rem" }}
                    >
                      Dipublikasi pada:{" "}
                      {formatDate(post.created_at || new Date())}
                    </small>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div
                className="card mb-4"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  border: "none",
                  animation: "fadeInUp 0.6s ease-out 0.3s backwards",
                  overflow: "hidden",
                }}
              >
                <div
                  className="card-header fw-bold border-bottom-0 p-4"
                  style={{
                    backgroundColor: SECONDARY_COLOR,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    fontSize: "1.2rem",
                    color: "white",
                  }}
                >
                  <i className="bi bi-chat-dots-fill me-2"></i>
                  {post.comments?.length || 0} Komentar
                </div>

                {/* List Komentar */}
                <div
                  className="list-group list-group-flush"
                  style={{ maxHeight: "60vh", overflowY: "auto" }}
                >
                  {!post.comments || post.comments.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                      <i
                        className="bi bi-chat-left-text"
                        style={{ fontSize: "3rem", color: "#ccc" }}
                      ></i>
                      <p className="lead mt-3 mb-0">
                        Jadilah yang pertama berkomentar!
                      </p>
                    </div>
                  ) : (
                    post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="list-group-item"
                        style={{
                          padding: "15px 20px",
                          borderBottom: "1px solid #f0f0f0",
                          backgroundColor: "#fff",
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
                className="card"
                style={{
                  borderRadius: 15,
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
                  border: "none",
                  animation: "fadeInUp 0.6s ease-out 0.4s backwards",
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
                          border: "2px solid #ddd",
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
            </div>{" "}
            {/* Penutup post-content-container */}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ChangeCoverModal
        show={showChangeCoverModal}
        // ⭐️ PERBAIKAN UTAMA: Menggunakan fungsi handleCoverModalClose yang baru
        onClose={handleCoverModalClose}
        post={post}
      />
    </>
  );
}

export default DetailPage;
