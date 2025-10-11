import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetIsPostChangeCover,
  asyncSetPost,
  setIsPostChangeCoverActionCreator,
  setIsPostChangedActionCreator,
} from "../states/action";

function ChangeCoverModal({ show, onClose, post }) {
  const dispatch = useDispatch();

  const isPostChangeCover = useSelector((state) => state.isPostChangeCover);
  const isPostChangedCover = useSelector((state) => state.isPostChangedCover);

  const [loading, setLoading] = useState(false);
  const [fileCover, setFileCover] = useState(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  useEffect(() => {
    if (isPostChangeCover) {
      dispatch(setIsPostChangeCoverActionCreator(false));
      if (isPostChangedCover) {
        dispatch(setIsPostChangedActionCreator(false));
        setLoading(false);
        dispatch(asyncSetPost(post.id));
        onClose();
      } else {
        setLoading(false);
      }
    }
  }, [isPostChangeCover]);

  function handleSave() {
    if (!fileCover) {
      showErrorDialog("Pilih file cover terlebih dahulu!");
      return;
    }

    if (!fileCover.type.startsWith("image/")) {
      showErrorDialog("Hanya file gambar yang diperbolehkan!");
      setFileCover(null);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (fileCover.size > MAX_FILE_SIZE) {
      showErrorDialog("Ukuran file terlalu besar. Maksimal 5MB");
      setFileCover(null);
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsPostChangeCover(post.id, fileCover));
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
                  <h1 className="modal-title fs-5">Ubah Cover Post</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Pilih Cover</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileCover(file);
                        }
                      }}
                      className="form-control"
                    />
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

export default ChangeCoverModal;

/*
 * Dokumentasi Kode
 *
 * ChangeCoverModal adalah komponen modal (pop-up) yang digunakan untuk mengubah gambar cover dari sebuah post tertentu.
 * Komponen ini menggunakan `framer-motion` untuk animasi dan Redux untuk mengelola status pengiriman perubahan cover ke API.
 *
 * Dependencies:
 * - motion, AnimatePresence dari "framer-motion": Untuk animasi masuk dan keluar modal.
 * - useEffect, useState dari "react": Hook standar React.
 * - showErrorDialog: Fungsi helper untuk menampilkan notifikasi kesalahan.
 * - useDispatch, useSelector dari "react-redux": Untuk interaksi dengan Redux store.
 * - asyncSetIsPostChangeCover, asyncSetPost, setIsPostChangeCoverActionCreator, setIsPostChangedActionCreator: Action Redux terkait post.
 *
 * Props:
 * - show: Boolean, mengontrol visibilitas modal.
 * - onClose: Fungsi callback untuk menutup modal.
 * - post: Objek data post yang covernya akan diubah (harus memiliki properti `id`).
 *
 * State:
 * - Redux State:
 * - isPostChangeCover: Boolean, menandai apakah proses penggantian cover sedang berjalan.
 * - isPostChangedCover: Boolean, menandai apakah penggantian cover berhasil.
 * - Local State:
 * - loading: Boolean, mengontrol status tombol "Simpan" (menampilkan spinner saat true).
 * - fileCover: Objek File, menyimpan file gambar cover baru yang dipilih oleh pengguna.
 *
 * Lifecycle Hooks:
 *
 * 1. Efek Kontrol Overflow Body (Dependensi: `[show]`):
 * - Mengatur `document.body.style.overflow` menjadi "hidden" saat modal tampil untuk mencegah scrolling di belakang modal.
 * - Mengatur ulang ke "auto" saat modal ditutup.
 *
 * 2. Efek Penanganan Status Penggantian Cover (Dependensi: `[isPostChangeCover]`):
 * - Dijalankan setelah operasi penggantian cover di Redux selesai (`isPostChangeCover` menjadi true).
 * - Mengatur ulang `isPostChangeCover` di Redux.
 * - Jika `isPostChangedCover` true (berhasil):
 * - Mengatur ulang `isPostChangedActionCreator`.
 * - Mengatur `loading` menjadi false.
 * - Mendispatch `asyncSetPost(post.id)` untuk memuat ulang data post yang diperbarui dari API.
 * - Menutup modal (`onClose()`).
 * - Jika gagal, hanya mengatur `loading` menjadi false.
 *
 * Fungsi handleSave():
 * - Fungsi yang dipanggil saat tombol Simpan diklik.
 * - Melakukan validasi file:
 * - Memastikan file telah dipilih.
 * - Memeriksa apakah tipe file adalah gambar (`image/*`).
 * - Memeriksa ukuran file (maksimal 5MB).
 * - Jika validasi gagal, menampilkan `showErrorDialog` dan mengatur ulang `fileCover`.
 * - Jika validasi berhasil:
 * - Mengatur `loading` menjadi true.
 * - Mendispatch `asyncSetIsPostChangeCover` dengan `post.id` dan `fileCover` untuk memulai proses unggah/penggantian cover.
 *
 * Rendering:
 * - Menggunakan `AnimatePresence` dan `motion.div` untuk animasi modal (fade dan spring-like slide).
 * - Menampilkan formulir dengan input `type="file"` yang hanya menerima file gambar (`accept="image/*"`).
 * - Tombol "Simpan" menampilkan spinner loading ketika `loading` true, dan tombol aktif yang memanggil `handleSave` ketika false.
 * - Mengembalikan `null` jika objek `post` belum tersedia.
 */
