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
      <div className="main-content">
        <div className="container-fluid mt-3">
          {/* NAV / TITLE DIHAPUS (sesuai permintaan) */}

          {/* ===== Jumlah Post (lebih lebar + warna aesthetic ala Instagram) ===== */}
          <div className="row mb-4">
            <div className="col-12">
              <div
                className="card text-white"
                style={{
                  border: "none",
                  borderRadius: 12,
                  padding: 0,
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, #f58529 0%, #dd2a7b 40%, #8134af 70%, #515bd4 100%)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  className="card-body d-flex align-items-center justify-content-between"
                  style={{ padding: "1.75rem" }}
                >
                  <div>
                    <h5
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        fontWeight: 700,
                      }}
                    >
                      Jumlah Post
                    </h5>
                    <div
                      style={{
                        fontSize: "2.25rem",
                        fontWeight: 700,
                        marginTop: 8,
                      }}
                    >
                      {displayedPosts.length}
                    </div>
                  </div>

                  {/* Kontrol Tampilkan + Tombol Tambah dipindahkan ke sini */}
                  <div style={{ minWidth: 240 }}>
                    <div className="mb-3">
                      <label
                        className="form-label text-white"
                        style={{ opacity: 0.95 }}
                      >
                        Tampilkan
                      </label>
                      <select
                        className="form-select"
                        value={ownerFilter}
                        onChange={(e) => changeOwnerFilter(e.target.value)}
                        style={{
                          borderRadius: 8,
                          padding: ".5rem",
                          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
                        }}
                      >
                        <option value="mine">Semua postingan saya</option>
                        <option value="all">Semua postingan pengguna</option>
                      </select>
                    </div>

                    <button
                      className="btn btn-light w-100"
                      onClick={() => setShowAddModal(true)}
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        color: "#222",
                        borderRadius: 10,
                        padding: ".6rem 0",
                        fontWeight: 600,
                        boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      <i
                        className="bi bi-plus-lg"
                        style={{ marginRight: 8 }}
                      ></i>
                      Tambah Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== AREA DAFTAR POST DENGAN BACKGROUND SOFT DAN ROUNDED CONTAINER ===== */}
          <div
            className="row justify-content-center"
            style={{
              background: "linear-gradient(180deg, #fdfbfb 0%, #ebedee 100%)",
              borderRadius: "20px",
              padding: "30px 25px",
              marginTop: "10px",
            }}
          >
            <div className="col-12 col-lg-10">
              <div
                className="card mb-3"
                style={{
                  borderRadius: "20px",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="card-body p-4"
                  style={{ backgroundColor: "#fff" }}
                >
                  {displayedPosts.length === 0 && (
                    <div className="text-center py-5">
                      <p className="lead text-muted mb-0">
                        Belum ada data post yang tersedia.
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
                            borderRadius: "18px",
                            overflow: "hidden",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                          }}
                        >
                          <PostCard
                            post={post}
                            profile={profile}
                            isOwner={isOwner} // <-- PASSED
                            onView={() => navigate(`/posts/${post.id}`)}
                            onEdit={
                              isOwner
                                ? () => handleEditPost(post.id)
                                : undefined
                            } // only if owner
                            onDelete={
                              isOwner
                                ? () => handleDeletePost(post.id)
                                : undefined
                            } // only if owner
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
