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
import PostCard from "../components/PostCard"; // Komponen baru untuk tampilan post

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ambil data dari reducer
  const profile = useSelector((state) => state.profile);
  const posts = useSelector((state) => state.posts);
  const isPostDeleted = useSelector((state) => state.isPostDeleted);

  const [filter, changeFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Ambil data posts
  useEffect(() => {
    dispatch(asyncSetPosts(filter));
  }, [filter]);

  // Jika post berhasil dihapus, perbarui daftar posts
  useEffect(() => {
    if (isPostDeleted) {
      dispatch(setIsPostDeleteActionCreator(false));
      // Menggunakan filter saat memuat ulang jika ada filter yang aktif
      dispatch(asyncSetPosts(filter));
    }
  }, [isPostDeleted]);

  if (!profile) return;

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
      {/* */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          <h2>Beranda</h2>
          <hr />
          {/* Bagian Ringkasan Tetap Sama */}
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Jumlah Post</h5>
                  <h2 className="card-text">{posts.length}</h2>
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
                    {posts.filter((post) => post.is_finished).length}
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
                    {posts.filter((post) => !post.is_finished).length}
                  </h2>
                  <i
                    className="bi bi-hourglass-split opacity-50 position-absolute bottom-0 end-0 pe-3"
                    style={{ fontSize: "3rem" }}
                  ></i>
                </div>
              </div>
            </div>
          </div>
          {/* --- */}

          {/* Bagian Filter dan Tombol Tambah */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <div className="flex-fill">
                  <h4 className="pt-1">Daftar Post</h4>
                </div>
                <div className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text">Filter</span>
                    <select
                      className="form-select"
                      value={filter}
                      onChange={(e) => changeFilter(e.target.value)}
                    >
                      <option value="">Semua</option>
                      <option value="1">Selesai</option>
                      <option value="0">Proses</option>
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
          {/* --- */}

          {/* Bagian Tampilan Postingan ala Instagram */}
          <div className="row justify-content-center">
            {posts.length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="lead">Belum ada data post yang tersedia.</p>
              </div>
            )}

            <div className="col-lg-6 col-md-8">
              {posts.map((post) => (
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

      {/* Modal */}
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
