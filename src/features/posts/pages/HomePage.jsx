// HomePage.jsx
import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsPostDelete,
  asyncSetPosts,
  setIsPostDeleteActionCreator,
} from "../states/action";
import {
  showConfirmDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import PostCard from "../components/PostCard";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const posts = useSelector((state) => state.posts);
  const isPostDeleted = useSelector((state) => state.isPostDeleted);

  // internal filter kept for compatibility
  const [filter, changeFilter] = useState("");
  const [ownerFilter, changeOwnerFilter] = useState("all"); // "all" | "mine"

  const [showAddModal, setShowAddModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    dispatch(asyncSetPosts(filter));
  }, [filter]);

  useEffect(() => {
    if (isPostDeleted) {
      dispatch(setIsPostDeleteActionCreator(false));
      dispatch(asyncSetPosts(filter));
    }
  }, [isPostDeleted]);

  if (!profile) return;

  function isPostCreatedByMe(post) {
    try {
      if (post.user_id && profile.id !== undefined) {
        return String(post.user_id) === String(profile.id);
      }
      if (post.user && post.user.id && profile.id !== undefined) {
        return String(post.user.id) === String(profile.id);
      }
      if (post.user && post.user.username && profile.username) {
        return String(post.user.username) === String(profile.username);
      }
      if (post.created_by && profile.id !== undefined) {
        return String(post.created_by) === String(profile.id);
      }
      if (post.author && post.author.id && profile.id !== undefined) {
        return String(post.author.id) === String(profile.id);
      }
    } catch (e) {}
    return false;
  }

  const displayedPosts = posts.filter((post) => {
    if (ownerFilter === "all") return true;
    return isPostCreatedByMe(post);
  });

  function handleDeletePost(postId) {
    const confirmDelete = showConfirmDialog(
      "Apakah Anda yakin ingin menghapus post ini?"
    );
    confirmDelete.then((result) => {
      if (result.isConfirmed) {
        dispatch(asyncSetIsPostDelete(postId));
      }
    });
  }

  function handleEditPost(postId) {
    setSelectedPostId(postId);
    setShowChangeModal(true);
  }

  // Definisikan kembali konstanta CSS dari LoginPage agar konsisten
  const GRADIENT_BG =
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"; // Mengambil gradien dari LoginPage
  const PRIMARY_COLOR = "#667eea";
  const ACCENT_COLOR = "#764ba2";

  return (
    <>
      {/* Tambahkan Style Global untuk Animasi Konsisten */}
      <style>
        {`
          @keyframes floatAnimation {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-5px) scale(1.01); } /* Dibuat lebih kecil dari LoginPage agar tidak terlalu agresif */
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px); /* Dibuat sama dengan LoginPage */
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .home-input-focus:focus {
            border-color: ${PRIMARY_COLOR} !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .home-btn-gradient {
            background: linear-gradient(135deg, #f58529 0%, #dd2a7b 100%); /* Gradient ala Instagram/Post Card */
            transition: all 0.3s ease;
          }
          .home-btn-gradient:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(245, 133, 41, 0.4);
          }
          .home-btn-gradient:active:not(:disabled) {
            transform: translateY(0);
          }
        `}
      </style>

      {/* Kontainer Utama dengan Full Screen Background & Padding agar konten tidak melebar full screen */}
      <div
        style={{
          minHeight: "100vh",
          padding: 0,
          background: GRADIENT_BG, // Menggunakan BG Gradien dari LoginPage
          transition: "opacity 0.6s ease",
          opacity: fadeIn ? 1 : 0,
        }}
      >
        {/* Animated Background Circles - Dibuat Fixed agar tidak ikut konten (Dibuat mirip LoginPage) */}
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

        {/* Main Content Container */}
        <div
          className="main-content"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div
            className="container-fluid pt-5 pb-5" // Tambah padding top & bottom
            style={{ maxWidth: 1000, margin: "0 auto", padding: "0 15px" }}
          >
            {/* ===== Jumlah Post & Filter Kontrol (Card Aesthetic Instagram) ===== */}
            <div className="row mb-5">
              <div className="col-12">
                <div
                  className="card text-white"
                  style={{
                    border: "none",
                    borderRadius: 24, // Lebih rounded, konsisten dengan LoginPage
                    padding: 0,
                    overflow: "hidden",
                    // Gradient yang lebih menarik & konsisten
                    background:
                      "linear-gradient(45deg, #515bd4 0%, #dd2a7b 50%, #f58529 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)", // Shadow lebih tegas
                    animation: "fadeInUp 0.6s ease-out", // Gunakan fadeInUp
                    transform: "translateY(0)",
                  }}
                >
                  <div
                    className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-md-between"
                    style={{ padding: "2.5rem" }}
                  >
                    {/* Statistik Jumlah Post */}
                    <div className="mb-4 mb-md-0 text-center text-md-start">
                      <h5
                        style={{
                          margin: 0,
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          textShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        Total Postingan
                      </h5>
                      <div
                        style={{
                          fontSize: "3.5rem", // Ukuran Font Lebih Besar
                          fontWeight: 800,
                          marginTop: 10,
                          lineHeight: 1,
                          textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                      >
                        {displayedPosts.length}
                      </div>
                      <p
                        style={{
                          fontSize: "1.1rem",
                          opacity: 0.9,
                          margin: 0,
                          fontWeight: 500,
                        }}
                      >
                        {ownerFilter === "mine"
                          ? "Postingan Saya"
                          : "Postingan Publik"}
                      </p>
                    </div>

                    {/* Kontrol Tampilkan + Tombol Tambah */}
                    <div style={{ minWidth: 280 }}>
                      <div className="mb-4">
                        <label
                          className="form-label text-white"
                          style={{
                            opacity: 0.95,
                            fontWeight: 600,
                            marginBottom: "10px",
                          }}
                        >
                          <i
                            className="bi bi-filter-square-fill"
                            style={{ marginRight: 8, fontSize: "1.1rem" }}
                          ></i>
                          Tampilkan Postingan
                        </label>
                        <select
                          className="form-select home-input-focus" // Class focus baru
                          value={ownerFilter}
                          onChange={(e) => changeOwnerFilter(e.target.value)}
                          style={{
                            borderRadius: 12,
                            padding: "12px 18px", // Padding lebih besar
                            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.2)",
                            border: "2px solid #e0e0e0", // Border lebih jelas
                            fontWeight: 500,
                            backgroundColor: "rgba(255,255,255,0.95)",
                            color: "#333",
                          }}
                        >
                          <option value="mine">Postingan Saya Saja</option>
                          <option value="all">Semua Postingan Pengguna</option>
                        </select>
                      </div>

                      <button
                        className="btn w-100 home-btn-gradient" // Class gradient baru
                        onClick={() => setShowAddModal(true)}
                        style={{
                          color: "white", // Ubah warna teks menjadi putih
                          borderRadius: 12,
                          padding: "0.75rem 0",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
                          transition: "all 0.3s ease",
                          border: "none",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "translateY(-3px)")
                        } // Hover dipindahkan ke CSS Class
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        } // Hover dipindahkan ke CSS Class
                      >
                        <i
                          className="bi bi-plus-circle-fill"
                          style={{ marginRight: 8, fontSize: "1.2rem" }}
                        ></i>
                        Buat Post Baru
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== AREA DAFTAR POST - Background Putih Transparan agar Konten Menonjol (Dipercantik) ===== */}
            <div
              className="row justify-content-center"
              style={{
                background: "rgba(255, 255, 255, 0.95)", // Opacity lebih tinggi
                backdropFilter: "blur(10px)", // Efek blur tipis
                borderRadius: "24px", // Radius lebih besar
                padding: "40px", // Padding lebih besar
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)", // Shadow lebih tegas
                marginBottom: "50px", // Tambah jarak di bawah
                animation: "fadeInUp 0.6s ease-out 0.2s backwards",
              }}
            >
              <div className="col-12">
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#333",
                    marginBottom: "30px",
                    borderBottom: `2px solid ${PRIMARY_COLOR}`,
                    paddingBottom: "10px",
                    display: "inline-block",
                  }}
                >
                  <i
                    className="bi bi-newspaper"
                    style={{ marginRight: "10px", color: PRIMARY_COLOR }}
                  ></i>
                  Timeline
                </h2>

                {displayedPosts.length === 0 && (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-chat-dots-fill"
                      style={{ fontSize: "4rem", color: "#ccc" }}
                    ></i>
                    <p className="lead text-muted mt-3 mb-0">
                      Belum ada post yang tersedia dalam filter ini.
                    </p>
                  </div>
                )}

                <div className="d-flex flex-column gap-4">
                  {displayedPosts.map((post) => {
                    const isOwner = isPostCreatedByMe(post);

                    return (
                      <div
                        key={`post-wrapper-${post.id}`}
                        style={{
                          borderRadius: "15px",
                          overflow: "hidden",
                          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                          backgroundColor: "#fff",
                          border: "1px solid #e0e0e0", // Border lebih terang
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 10px 25px rgba(0,0,0,0.15)";
                          e.currentTarget.style.transform = "translateY(-5px)"; // Efek hover lebih menonjol
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 5px 15px rgba(0,0,0,0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <PostCard
                          post={post}
                          profile={profile}
                          isOwner={isOwner}
                          onView={() => navigate(`/posts/${post.id}`)}
                          onEdit={
                            isOwner ? () => handleEditPost(post.id) : undefined
                          }
                          onDelete={
                            isOwner
                              ? () => handleDeletePost(post.id)
                              : undefined
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddModal
        show={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          showSuccessDialog("Berhasil menambahkan post baru!");
        }}
      />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        postId={selectedPostId}
      />
    </>
  );
}

export default HomePage;
