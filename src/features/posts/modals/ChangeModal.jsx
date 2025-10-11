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

  const isPostChange = useSelector((state) => state.isPostChange);
  const isPostChanged = useSelector((state) => state.isPostChanged);
  const post = useSelector((state) => state.post);

  const [loading, setLoading] = useState(false);

  const [cover, changeCover] = useState(null);
  const [description, changeDescription] = useState("");

  useEffect(() => {
    if (postId) {
      dispatch(asyncSetPost(postId));
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      changeDescription(post.description);
      console.log(post);
      changeCover(post.cover);
    }
  }, [post]);

  useEffect(() => {
    if (isPostChange) {
      setLoading(false);
      dispatch(setIsPostChangeActionCreator(false));
      if (isPostChanged) {
        dispatch(setIsPostChangedActionCreator(false));
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

  function handleSave() {
    if (!cover) {
      showErrorDialog("Cover tidak boleh kosong");
      return;
    }
    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsPostChange(postId, cover, description));
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
                    <label className="form-label">Cover</label>
                    <input
                      type="file"
                      onChange={(e) => changeCover(e.target.files?.[0] || null)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      onChange={(e) => changeDescription(e.target.value)}
                      className="form-control"
                      rows="3"
                      value={description}
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

/*
 * Dokumentasi Kode
 *
 * ChangeModal adalah komponen modal fungsional React yang digunakan untuk mengedit deskripsi dan (opsional) cover dari post yang sudah ada.
 * Komponen ini menggunakan `framer-motion` untuk animasi dan Redux untuk memuat data post serta menangani proses pengeditan.
 *
 * Dependencies:
 * - motion, AnimatePresence dari "framer-motion": Untuk animasi deklaratif.
 * - useEffect, useState dari "react": Hook standar React.
 * - useInput: Hook yang diimpor, meskipun implementasi `changeDescription` dan `changeCover` langsung menggunakan `useState` setters.
 * - showErrorDialog: Fungsi helper untuk menampilkan notifikasi kesalahan.
 * - useDispatch, useSelector dari "react-redux": Untuk interaksi dengan Redux store.
 * - asyncSetIsPostChange, asyncSetPost, asyncSetPosts, setIsPostChangeActionCreator, setIsPostChangedActionCreator: Action Redux.
 *
 * Props:
 * - show: Boolean, mengontrol visibilitas modal.
 * - onClose: Fungsi callback untuk menutup modal.
 * - postId: ID dari post yang akan diedit.
 *
 * State:
 * - Redux State:
 * - isPostChange: Boolean, menunjukkan status proses pengeditan post.
 * - isPostChanged: Boolean, menunjukkan apakah pengeditan post berhasil.
 * - post: Objek data post yang saat ini sedang dimuat atau diedit (diambil berdasarkan `postId`).
 * - Local State:
 * - loading: Boolean, mengontrol tampilan spinner pada tombol Simpan.
 * - cover: Menyimpan nilai file gambar baru (Objek File) atau URL cover lama (String).
 * - description: String, nilai input textarea deskripsi.
 *
 * Lifecycle Hooks:
 *
 * 1. Pemuatan Data Post Awal (Dependensi: `[postId]`):
 * - Ketika `postId` tersedia, mendispatch `asyncSetPost(postId)` untuk memuat data post ke Redux store.
 *
 * 2. Inisialisasi Input (Dependensi: `[post]`):
 * - Ketika objek `post` dari Redux tersedia, mengisi state lokal `description` dan `cover` dengan data yang ada (`post.description` dan `post.cover`) agar form menampilkan nilai awal.
 *
 * 3. Penanganan Status Pengeditan (Dependensi: `[isPostChange]`):
 * - Dijalankan setelah operasi pengeditan post di Redux selesai.
 * - Mengatur `loading` menjadi false.
 * - Mengatur ulang `isPostChange` di Redux.
 * - Jika `isPostChanged` true (berhasil):
 * - Mengatur ulang `isPostChanged` di Redux.
 * - Mendispatch `asyncSetPosts()` untuk memuat ulang daftar post di halaman beranda.
 * - Menutup modal (`onClose()`).
 *
 * 4. Efek Kontrol Overflow Body (Dependensi: `[show]`):
 * - Mengontrol scrolling pada `document.body` saat modal ditampilkan/ditutup.
 *
 * Fungsi handleSave():
 * - Melakukan validasi dasar pada `cover` dan `description`.
 * - Jika validasi berhasil:
 * - Mengatur `loading` menjadi true.
 * - Mendispatch `asyncSetIsPostChange` dengan `postId`, data `cover`, dan `description` untuk mengirimkan perubahan ke API.
 *
 * Rendering:
 * - Menggunakan `AnimatePresence` dan `motion.div` untuk animasi modal.
 * - Formulir memungkinkan pengguna mengubah file cover (input type="file") dan deskripsi (textarea).
 * - Catatan: Input `type="file"` akan selalu mengembalikan file baru atau `null`. Jika pengguna tidak memilih file baru, nilai `cover` akan dikirim sesuai nilai awal dari `post.cover`.
 * - Tombol "Simpan" menampilkan spinner loading saat `loading` true.
 * - Mengembalikan `null` jika objek `post` belum tersedia, mencegah modal render sebelum data dimuat.
 */
