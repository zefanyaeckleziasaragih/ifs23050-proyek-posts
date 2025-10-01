import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetIsPostChange,
  asyncSetPost,
  asyncSetPosts,
  setIsPostChangeActionCreator,
  setIsPostChangedActionCreator,
} from "../states/action";

function ChangeModal({ show, onClose, postId }) {
  const dispatch = useDispatch();

  // State dari reducer
  const isPostChange = useSelector((state) => state.isPostChange);
  const isPostChanged = useSelector((state) => state.isPostChanged);
  const post = useSelector((state) => state.post);

  const [loading, setLoading] = useState(false);

  const [title, changeTitle] = useState("");
  const [description, changeDescription] = useState("");
  const [isFinished, changeIsFinished] = useState(false);

  // 1. Ambil data post sesuai postId
  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId]);

  // 2. Ubah nilai pada input
  useEffect(() => {
    if (post) {
      changeTitle(post.title);
      changeDescription(post.description);
      changeIsFinished(post.is_finished);
    }
  }, [post]);

  // 3. Cek apakah isPostChange sudah selesai
  useEffect(() => {
    if (isPostChange) {
      setLoading(false);
      dispatch(setIsPostChangeActionCreator(false));
      if (isPostChanged) {
        dispatch(setIsPostChangedActionCreator(false));
        // perbarui data posts
        dispatch(asyncSetPosts());
        onClose();
      }
    }
  }, [isPostChange]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  // Fungsi save
  function handleSave() {
    if (!title) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }

    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsPostChange(postId, title, description, isFinished));
  }

  if (!post) return;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-backdrop"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="modal"
            tabIndex="-1"
            style={{ display: "block" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h1 className="modal-title fs-5">Ubah Post</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => changeTitle(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={isFinished ? "true" : "false"}
                      onChange={(e) =>
                        changeIsFinished(e.target.value === "true")
                      }
                    >
                      <option value="false">Proses</option>
                      <option value="true">Selesai</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      value={description}
                      onChange={(e) => changeDescription(e.target.value)}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    <i className="bi bi-x-circle"></i> Batal
                  </button>

                  {loading ? (
                    <button type="button" className="btn btn-primary" disabled>
                      <span className="spinner-border spinner-border-sm"></span>
                      &nbsp;Menyimpan...
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      <i className="bi bi-save"></i> Simpan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ChangeModal;
