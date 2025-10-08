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
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import PostCard from "../components/PostCard";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const posts = useSelector((state) => state.posts);
  const isPostDeleted = useSelector((state) => state.isPostDeleted);

  // keep filter state internal (not shown in UI) in case backend expects it
  const [filter, changeFilter] = useState("");

  // owner filter: "all" = semua pengguna, "mine" = hanya postingan saya
  const [ownerFilter, changeOwnerFilter] = useState("all");

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

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Jumlah Post</h5>
                  <h2 className="card-text">{displayedPosts.length}</h2>
                  <i
                    className="bi bi-list-check opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Post Selesai</h5>
                  <h2 className="card-text">
                    {displayedPosts.filter((post) => post.is_finished).length}
                  </h2>
                  <i
                    className="bi bi-check-circle opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <h5 className="card-title">Post Proses</h5>
                  <h2 className="card-text">
                    {displayedPosts.filter((post) => !post.is_finished).length}
                  </h2>
                  <i
                    className="bi bi-hourglass-split opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div className="flex-fill">
                  <h4 className="pt-1">Daftar Post</h4>
                </div>
                <div className="d-flex gap-2">
                  {/* HAPUS kontrol Filter (sesuai permintaan)
                      Hanya tampilkan kontrol "Tampilkan" dengan label & opsi yang diminta */}
                  <div className="input-group">
                    <span className="input-group-text">Tampilkan</span>
                    <select
                      className="form-select"
                      value={ownerFilter}
                      onChange={(e) => changeOwnerFilter(e.target.value)}
                    >
                      <option value="mine">Semua postingan saya</option>
                      <option value="all">Semua postingan pengguna</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                  >
                    <i className="bi bi-plus"></i> Tambah Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            {displayedPosts.length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="lead">Belum ada data post yang tersedia.</p>
              </div>
            )}

            <div className="col-lg-6 col-md-8">
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
