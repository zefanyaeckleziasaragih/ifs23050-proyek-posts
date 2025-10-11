import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncSetIsPostAdd,
  asyncSetPosts,
  setIsPostAddActionCreator,
  setIsPostAddedActionCreator,
} from "../states/action";

function AddModal({ show, onClose }) {
  const dispatch = useDispatch();

  const isPostAdd = useSelector((state) => state.isPostAdd);
  const isPostAdded = useSelector((state) => state.isPostAdded);

  const [loading, setLoading] = useState(false);

  const [cover, setCover] = useState(null);
  const [description, changeDescription] = useInput("");

  useEffect(() => {
    if (isPostAdd) {
      setLoading(false);
      dispatch(setIsPostAddActionCreator(false));
      if (isPostAdded) {
        dispatch(setIsPostAddedActionCreator(false));
        dispatch(asyncSetPosts());
        onClose();
      }
    }
  }, [isPostAdd]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  function handleSave() {
    if (!cover) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }

    if (!description) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    setLoading(true);
    dispatch(asyncSetIsPostAdd(cover, description));
  }

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
                  <h1 className="modal-cover fs-5">Tambah Post</h1>
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
                      onChange={(e) => setCover(e.target.files?.[0] || null)}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                      onChange={changeDescription}
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

export default AddModal;

/*
 * Dokumentasi Kode
 *
 * AddModal adalah komponen fungsional React yang menampilkan modal untuk menambahkan kiriman (post) baru.
 * Komponen ini menggunakan `framer-motion` untuk animasi modal dan Redux untuk mengelola status penambahan post ke API.
 *
 * Dependencies:
 * - motion, AnimatePresence dari "framer-motion": Untuk animasi deklaratif.
 * - useEffect, useState dari "react": Hook standar React.
 * - useInput: Custom hook untuk mengelola input teks (deskripsi).
 * - showErrorDialog: Fungsi helper untuk menampilkan pesan kesalahan.
 * - useDispatch, useSelector dari "react-redux": Untuk interaksi dengan Redux store.
 * - asyncSetIsPostAdd, asyncSetPosts, setIsPostAddActionCreator, setIsPostAddedActionCreator: Action Redux.
 *
 * Props:
 * - show: Boolean, mengontrol apakah modal harus ditampilkan.
 * - onClose: Fungsi callback yang dipanggil untuk menutup modal.
 *
 * State:
 * - Redux State:
 * - isPostAdd: Boolean, menunjukkan proses penambahan post sedang berlangsung/sudah selesai.
 * - isPostAdded: Boolean, menunjukkan apakah post berhasil ditambahkan.
 * - Local State:
 * - loading: Boolean, mengontrol tampilan spinner pada tombol Simpan.
 * - cover: Objek File, menyimpan file gambar cover yang dipilih.
 * - description: String, nilai input textarea deskripsi (dikelola oleh `useInput`).
 *
 * Lifecycle Hooks:
 *
 * 1. Efek Penanganan Status Post (Dependensi: `[isPostAdd]`):
 * - Dijalankan ketika status `isPostAdd` (dari Redux) berubah.
 * - Jika `isPostAdd` true, artinya operasi post telah selesai (berhasil atau gagal).
 * - Mengatur `loading` menjadi false.
 * - Mengatur ulang `isPostAdd` di Redux menjadi false.
 * - Jika `isPostAdded` true (post berhasil), akan:
 * - Mengatur ulang `isPostAdded` di Redux menjadi false.
 * - Memuat ulang daftar post (`dispatch(asyncSetPosts())`) untuk memperbarui tampilan.
 * - Menutup modal (`onClose()`).
 *
 * 2. Efek Kontrol Overflow Body (Dependensi: `[show]`):
 * - Mencegah scrolling pada body di belakang modal dengan mengatur `document.body.style.overflow = "hidden"` ketika modal ditampilkan (`show` true).
 * - Mengatur ulang ke `auto` ketika modal ditutup.
 *
 * Fungsi handleSave():
 * - Fungsi yang dipanggil saat tombol Simpan diklik.
 * - Melakukan validasi dasar: memastikan `cover` (gambar) dan `description` tidak kosong, menampilkan `showErrorDialog` jika gagal.
 * - Jika validasi berhasil:
 * - Mengatur `loading` menjadi true (menampilkan spinner).
 * - Mendispatch `asyncSetIsPostAdd` dengan data `cover` dan `description` untuk memulai proses penambahan post ke API.
 *
 * Rendering (Menggunakan Framer Motion):
 * - `<AnimatePresence>`: Memastikan komponen anak dianimasikan saat masuk atau keluar.
 * - Backdrop: `motion.div` yang mengatur latar belakang gelap.
 * - Animasi: Fade in/out opacity.
 * - Modal: `motion.div` utama modal.
 * - Animasi: Fade in/out dan pergeseran vertikal (`y: -50` ke `y: 0`) menggunakan transisi `spring` untuk efek yang lebih alami.
 * - Konten Modal: Form untuk mengunggah `Cover` (input type="file") dan memasukkan `Deskripsi` (textarea).
 * - Tombol Simpan: Ditampilkan sebagai spinner *loading* saat `loading` true, atau sebagai tombol Simpan yang memanggil `handleSave` saat false.
 */
