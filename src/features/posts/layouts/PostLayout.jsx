import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

function PostLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    } else {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));

      if (!profile) {
        apiHelper.putAccessToken("");
        navigate("/auth/login");
      }
    }
  }, [isProfile]);

  function handleLogout() {
    apiHelper.putAccessToken("");
    navigate("/auth/login");
  }

  if (!profile) return;

  return (
    <div className="container-fluid">
      <NavbarComponent profile={profile} handleLogout={handleLogout} />

      <SidebarComponent />

      <Outlet />
    </div>
  );
}

export default PostLayout;

/*
 * Dokumentasi Kode
 *
 * PostLayout adalah komponen tata letak (layout) utama untuk bagian aplikasi yang memerlukan otentikasi (authenticated routes).
 * Komponen ini bertanggung jawab untuk memuat Navbar, Sidebar, dan memastikan pengguna telah login sebelum menampilkan konten apa pun.
 *
 * Dependencies:
 * - useDispatch, useSelector dari "react-redux": Untuk interaksi dengan Redux store.
 * - Outlet, useLocation, useNavigate dari "react-router-dom": Untuk routing.
 * - apiHelper: Helper untuk mengelola token akses.
 * - asyncSetProfile, setIsProfile: Action Redux untuk mengelola data profil pengguna.
 * - useEffect: Hook standar React.
 * - NavbarComponent, SidebarComponent: Komponen presentasi untuk tata letak.
 *
 * State Global (Redux):
 * - profile: Objek data profil pengguna yang sedang login.
 * - isProfile: Boolean yang digunakan sebagai flag untuk menandakan bahwa proses pengambilan profil telah selesai (berhasil atau gagal).
 *
 * Lifecycle (useEffect):
 *
 * 1. Efek Inisialisasi (mount-only, dependensi: `[]`):
 * - Memeriksa keberadaan `authToken` (token akses) menggunakan `apiHelper.getAccessToken()`.
 * - Jika token ada, mendispatch `asyncSetProfile()` untuk mengambil data profil pengguna.
 * - Jika token tidak ada, mengarahkan pengguna ke halaman login (`/auth/login`).
 *
 * 2. Efek Sinkronisasi Profil (dependensi: `[isProfile]`):
 * - Berjalan setelah `asyncSetProfile` selesai dan mengubah state `isProfile` menjadi `true`.
 * - Segera mengatur ulang `isProfile` kembali ke `false` agar efek tidak terulang.
 * - Memeriksa apakah data `profile` berhasil dimuat.
 * - Jika `profile` **tidak ada** (yang berarti pengambilan profil gagal, mungkin karena token kedaluwarsa atau tidak valid), token akses dihapus (`apiHelper.putAccessToken("")`), dan pengguna diarahkan kembali ke halaman login.
 *
 * Fungsi handleLogout():
 * - Bertanggung jawab untuk proses logout.
 * - Menghapus token akses yang tersimpan.
 * - Mengarahkan pengguna ke halaman login (`/auth/login`).
 *
 * Rendering:
 * - Jika data `profile` belum tersedia (`!profile`), komponen mengembalikan `null` atau `undefined`, mencegah rendering elemen tata letak yang memerlukan data profil.
 * - Setelah `profile` dimuat, komponen merender:
 * - `<NavbarComponent>`: Meneruskan data `profile` dan fungsi `handleLogout`.
 * - `<SidebarComponent>`: Menampilkan bilah sisi navigasi.
 * - `<Outlet>`: Placeholder dari `react-router-dom` untuk merender komponen rute anak yang cocok (isi utama halaman).
 */
