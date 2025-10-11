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
  const [fadeIn, setFadeIn] = useState(false);

  const profile = useSelector((state) => state.profile);
  const post = useSelector((state) => state.post);
  const isPost = useSelector((state) => state.isPost);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId, dispatch]);

  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        navigate("/");
      }
    }
  }, [isPost, post, navigate, dispatch]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      dispatch(asyncPostComment(postId, profile.name + ": " + newComment));

      setTimeout(() => {
        dispatch(asyncSetPost(postId));
      }, 500);

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
          dispatch(asyncDeleteComment(postId, commentId));

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

  const isPostOwner =
    String(post.created_by) === String(profile.id) ||
    String(post.author?.id) === String(profile.id) ||
    String(post.user_id) === String(profile.id);

  const PRIMARY_COLOR = "#667eea";
  const SECONDARY_COLOR = "#764ba2";
  const ACCENT_COLOR = "#f58529";
  const GRADIENT_BG =
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";

  const handleCoverModalClose = (coverUpdated) => {
    setShowChangeCoverModal(false);

    if (coverUpdated === true) {
      setTimeout(() => {
        dispatch(asyncSetPost(postId));
      }, 300);
    }
  };

  return (
    <>
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
          @keyframes floatAnimation { 
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
          .hover-scale-detail { 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hover-scale-detail:hover {
            transform: scale(1.005) translateY(-3px) !important;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15) !important;
          }
          .post-content-container { 
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 15px 50px rgba(0,0,0,0.2);
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          padding: 0,
          background: GRADIENT_BG,
          transition: "opacity 0.6s ease",
          opacity: fadeIn ? 1 : 0,
          paddingTop: "90px",
        }}
      >
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

        <div
          className="main-content"
          style={{ position: "relative", zIndex: 10, paddingBottom: "40px" }}
        >
          <div
            className="container-fluid"
            style={{ maxWidth: 800, margin: "0 auto", padding: "0 15px" }}
          >
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
                  style={{ color: "#FFFFFF" }}
                ></i>
                Detail Postingan
              </h1>
            </div>
            <div
              style={{
                height: "4px",
                background: `linear-gradient(90deg, #FFFFFF, rgba(255, 255, 255, 0.5))`,
                borderRadius: "5px",
                marginBottom: "30px",
                animation: "fadeInUp 0.6s ease-out 0.1s backwards",
              }}
            />
            <div className="post-content-container">
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
            </div>
          </div>
        </div>
      </div>

      <ChangeCoverModal
        show={showChangeCoverModal}
        onClose={handleCoverModalClose}
        post={post}
      />
    </>
  );
}

export default DetailPage;

/*
 * Dokumentasi Kode
 *
 * DetailPage adalah komponen halaman yang menampilkan detail post, memungkinkan pemilik post untuk mengganti cover, serta memfasilitasi penambahan dan penghapusan komentar.
 *
 * Dependencies:
 * - useSelector, useDispatch dari "react-redux": Untuk interaksi dengan Redux store.
 * - useNavigate, useParams dari "react-router-dom": Untuk navigasi dan mengambil parameter rute (`postId`).
 * - useState, useEffect dari "react": Hook standar React.
 * - asyncSetPost, setIsPostActionCreator, asyncPostComment, asyncDeleteComment: Action Redux untuk post dan komentar.
 * - formatDate, showConfirmDialog: Helper untuk memformat tanggal dan menampilkan dialog konfirmasi.
 * - ChangeCoverModal: Komponen modal untuk mengganti cover post.
 *
 * State:
 * - Redux State:
 * - profile: Data profil pengguna yang sedang login.
 * - post: Objek post yang sedang dilihat, termasuk daftar komentarnya (diambil berdasarkan `postId`).
 * - isPost: Boolean, flag yang menunjukkan status proses pengambilan data post.
 * - Local State:
 * - showChangeCoverModal: Boolean, mengontrol visibilitas modal ganti cover.
 * - newComment: String, menyimpan input komentar baru.
 * - fadeIn: Boolean, mengontrol efek transisi fade-in halaman.
 *
 * Lifecycle Hooks (useEffect):
 *
 * 1. Efek Fade In (Dependensi: `[]`):
 * - Mengatur `fadeIn` menjadi true setelah render awal untuk memulai animasi fade-in halaman.
 *
 * 2. Pemuatan Post (Dependensi: `[postId, dispatch]`):
 * - Dijalankan saat komponen dimuat atau `postId` berubah.
 * - Mendispatch `asyncSetPost(postId)` untuk mengambil data post spesifik.
 *
 * 3. Validasi Post dan Navigasi (Dependensi: `[isPost, post, navigate, dispatch]`):
 * - Dijalankan setelah status `isPost` (status pengambilan post) berubah menjadi true.
 * - Mengatur ulang `isPost` di Redux.
 * - Jika data `post` tidak ditemukan (misalnya, post telah dihapus), pengguna diarahkan ke halaman beranda (`/`).
 *
 * Fungsi handleSubmitComment(e):
 * - Menangani pengiriman form komentar baru.
 * - Memastikan input komentar tidak kosong.
 * - Mendispatch `asyncPostComment` dengan menambahkan nama pengguna ke konten komentar.
 * - Menggunakan `setTimeout` (500ms) untuk memberi waktu API memproses, lalu memuat ulang data post (`asyncSetPost`) untuk memperbarui daftar komentar.
 * - Mengosongkan input `newComment`.
 *
 * Fungsi handleDeleteComment(commentId):
 * - Menangani permintaan penghapusan komentar.
 * - Menampilkan `showConfirmDialog` untuk konfirmasi pengguna.
 * - Jika dikonfirmasi, mendispatch `asyncDeleteComment`.
 * - Menggunakan `setTimeout` (500ms) untuk memberi waktu API memproses, lalu memuat ulang data post (`asyncSetPost`) untuk memperbarui daftar komentar.
 *
 * Fungsi handleCoverModalClose(coverUpdated):
 * - Dipanggil saat `ChangeCoverModal` ditutup.
 * - Mengatur `showChangeCoverModal` menjadi false.
 * - Jika `coverUpdated` bernilai true (modal menandakan cover berhasil diubah), maka `asyncSetPost` dipanggil setelah penundaan singkat (300ms) untuk mengambil data post yang diperbarui.
 *
 * Variabel isPostOwner:
 * - Digunakan untuk menentukan apakah pengguna yang sedang login adalah pemilik post, mengizinkan akses ke tombol "Ganti Cover" atau "Tambah Cover". Pengecekan dilakukan terhadap beberapa kemungkinan properti ID pengguna (`created_by`, `author.id`, `user_id`).
 *
 * Rendering:
 * - Menggunakan gaya CSS kustom untuk estetika (gradien latar belakang, animasi fade-in, dll.) yang konsisten dengan desain Home Page.
 * - Menampilkan cover post (jika ada) dan tombol "Ganti Cover" jika pengguna adalah pemilik post.
 * - Menampilkan deskripsi post dan info penulis/tanggal.
 * - Bagian Komentar: Menampilkan jumlah komentar, daftar komentar yang dapat discroll, dan formulir untuk menambahkan komentar baru.
 * - Menggunakan komponen `ChangeCoverModal` untuk fungsi penggantian cover.
 */
