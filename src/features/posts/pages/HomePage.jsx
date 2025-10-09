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

  return (
    <>
      {/* Tambahkan Style Global untuk Animasi Konsisten */}
      <style>
        {`
          @keyframes floatAnimation {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-5px) scale(1.01); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* Kontainer Utama dengan Full Screen Background & Padding agar konten tidak melebar full screen */}
      <div
        style={{
          // Mengembalikan background gradient full screen, tetapi content berada dalam main-content layout
          minHeight: "100vh",
          padding: 0,
          // Background konsisten dengan AuthLayout
          background:
            "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd140 100%)",
          transition: "opacity 0.5s ease",
          opacity: fadeIn ? 1 : 0,
        }}
      >
        {/* Animated Background Circles - Dibuat Fixed agar tidak ikut konten */}
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
          }}
        />

        {/* Main Content Container: Gunakan div standar agar tidak menabrak layout utama (Sidebar/Navbar) */}
        <div
          className="main-content"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div
            className="container-fluid mt-3"
            style={{ maxWidth: 1000, margin: "0 auto", padding: "0 15px" }}
          >
            {/* ===== Jumlah Post & Filter Kontrol (Card Aesthetic Instagram) ===== */}
            <div className="row mb-5">
              <div className="col-12">
                <div
                  className="card text-white"
                  style={{
                    border: "none",
                    borderRadius: 20, // Lebih rounded
                    padding: 0,
                    overflow: "hidden",
                    // Gradient yang lebih menarik
                    background:
                      "linear-gradient(45deg, #515bd4 0%, #dd2a7b 50%, #f58529 100%)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
                    animation:
                      "fadeInUp 0.6s ease-out, floatAnimation 8s ease-in-out infinite",
                    transform: "translateY(0)", // Base for animation
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
                        {/* Hapus "Halo, !" */}
                        Total Postingan
                      </h5>
                      <div
                        style={{
                          fontSize: "3rem",
                          fontWeight: 800,
                          marginTop: 10,
                          lineHeight: 1,
                          textShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        }}
                      >
                        {displayedPosts.length}
                      </div>
                      <p style={{ fontSize: "1rem", opacity: 0.9, margin: 0 }}>
                        {ownerFilter === "mine"
                          ? "Postingan Saya"
                          : "Postingan Publik"}
                      </p>
                    </div>

                    {/* Kontrol Tampilkan + Tombol Tambah */}
                    <div style={{ minWidth: 260 }}>
                      <div className="mb-3">
                        <label
                          className="form-label text-white"
                          style={{ opacity: 0.95, fontWeight: 600 }}
                        >
                          Tampilkan Postingan
                        </label>
                        <select
                          className="form-select"
                          value={ownerFilter}
                          onChange={(e) => changeOwnerFilter(e.target.value)}
                          style={{
                            borderRadius: 12,
                            padding: ".75rem 1rem",
                            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.2)",
                            border: "none",
                            fontWeight: 500,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            color: "#333",
                          }}
                        >
                          <option value="mine">Postingan Saya Saja</option>
                          <option value="all">Semua Postingan Pengguna</option>
                        </select>
                      </div>

                      <button
                        className="btn w-100"
                        onClick={() => setShowAddModal(true)}
                        style={{
                          background: "#fff",
                          color: "#dd2a7b",
                          borderRadius: 12,
                          padding: "0.75rem 0",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "translateY(-2px)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "translateY(0)")
                        }
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

            {/* ===== AREA DAFTAR POST - Background Putih Transparan agar Konten Menonjol ===== */}
            <div
              className="row justify-content-center"
              style={{
                // Background putih transparan di atas gradient utama
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "20px",
                padding: "30px 25px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                marginBottom: "30px", // Tambah jarak di bawah
                animation: "fadeInUp 0.6s ease-out 0.2s backwards",
              }}
            >
              <div className="col-12">
                {displayedPosts.length === 0 && (
                  <div className="text-center py-5">
                    <i
                      className="bi bi-chat-dots-fill"
                      style={{ fontSize: "3rem", color: "#ccc" }}
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
                          border: "1px solid #eee",
                          transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.boxShadow =
                            "0 10px 25px rgba(0,0,0,0.15)";
                          e.currentTarget.style.transform = "translateY(-3px)";
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
