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
} from "../states/action";
import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
import ChangeCoverModal from "../modals/ChangeCoverModal";

function DetailPage() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showChangeCoverModal, setShowChangeCoverModal] = useState(false);

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

  if (!profile || !post) return;

  return (
    <>
      {/* <!-- Main Content --> */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          <div className="d-flex">
            <div className="flex-fill">
              <h2>
                {post.title}
                {post.is_finished ? (
                  <span className="badge bg-success ms-2">Selesai</span>
                ) : (
                  <span className="badge bg-warning ms-2">Proses</span>
                )}
              </h2>
            </div>
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

          <div className="card">
            <div className="card-body">
              {post.cover ? (
                <div>
                  <img width="100%" src={post.cover} alt="Cover Post" />
                </div>
              ) : null}

              {post.description}
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
