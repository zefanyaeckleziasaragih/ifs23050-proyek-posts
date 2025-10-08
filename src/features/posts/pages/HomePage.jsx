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
import { showConfirmDialog } from "../../../helpers/toolsHelper";
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
          <h2>Beranda</h2>
          <hr />

          {/* Besar: satu kartu Jumlah Post di atas */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="card bg-primary text-white">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title">Jumlah Post</h5>
                    <h2 className="card-text">{displayedPosts.length}</h2>
                  </div>
                  <i
                    className="bi bi-list-check opacity-50"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          {/* DUA CONTAINER: kiri = sampingan (jumlah + kontrol), kanan = daftar post */}
          <div className="row">
            {/* KIRI: sampingan compact */}
            <div className="col-lg-3 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="mt-4">
                    <label className="form-label">Tampilkan</label>
                    <select
                      className="form-select mb-3"
                      value={ownerFilter}
                      onChange={(e) => changeOwnerFilter(e.target.value)}
                    >
                      <option value="mine">Semua postingan saya</option>
                      <option value="all">Semua postingan pengguna</option>
                    </select>

                    <button
                      className="btn btn-primary w-100"
                      onClick={() => setShowAddModal(true)}
                    >
                      <i className="bi bi-plus-lg"></i> Tambah Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* KANAN: daftar post */}
            <div className="col-lg-9">
              <div className="card mb-3">
                <div className="card-header">
                  <h4 className="pt-1 mb-0">Daftar Post</h4>
                </div>
              </div>

              <div className="row">
                {displayedPosts.length === 0 && (
                  <div className="col-12 text-center py-5">
                    <p className="lead">Belum ada data post yang tersedia.</p>
                  </div>
                )}

                <div className="col-12">
                  {displayedPosts.map((post) => (
                    <PostCard
                      key={`post-${post.id}`}
                      post={post}
                      profile={profile}
                      onView={() => navigate(`/posts/${post.id}`)}
                      onEdit={() => handleEditPost(post.id)}
                      onDelete={() => handleDeletePost(post.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      <ChangeModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        postId={selectedPostId}
      />
    </>
  );
}

export default HomePage;
