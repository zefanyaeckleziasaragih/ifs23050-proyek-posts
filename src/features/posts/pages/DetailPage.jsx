import { useSelector, useDispatch } from "react-redux";
import "../resources/custom.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AddModal from "../modals/AddModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncSetIsPostDelete,
  asyncSetPost,
  asyncSetPosts,
  setIsPostActionCreator,
  setIsPostDeleteActionCreator,
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
  }, [postId]);

  // Periksa apakah pengabilan data post sudah selesai
  useEffect(() => {
    if (isPost) {
      dispatch(setIsPostActionCreator(false));
      if (!post) {
        navigate("/posts");
      }
    }
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Post comment to API
      dispatch(asyncPostComment(postId, newComment));
      
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
      dispatch(asyncDeleteComment(postId, commentId));
      
      // Refresh post data to get updated comments
      dispatch(asyncSetPost(postId));
      
      console.log("Berhasil menghapus komen:", commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!profile || !post) return;

  return (
    <>
      {/* <!-- Main Content --> */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          <div className="d-flex">
            <div className="flex-fill"></div>
            <div>
              <button
                type="button"
                className="btn btn-warning"
                onClick={() => setShowChangeCoverModal(true)}
              >
                <i className="bi bi-image"></i> Ubah Cover
              </button>
            </div>
          </div>
          <hr />

          <div className="card mb-4">
            <div className="card-body">
              {post.cover ? (
                <div>
                  <img width="100%" src={post.cover} alt="Cover Post" />
                </div>
              ) : null}

              {post.description}
            </div>
          </div>

          {/* Comments Section */}
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
