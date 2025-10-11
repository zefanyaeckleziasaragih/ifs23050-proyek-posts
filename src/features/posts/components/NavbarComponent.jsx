import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavbarComponent({ profile, handleLogout }) {
  const navigate = useNavigate();

  const getPhotoUrl = (photo) => {
    if (!photo) return "/user.png";
    if (photo.startsWith("http") || photo.startsWith("https")) return photo;
    return `${
      process.env.REACT_APP_DELCOM_BASEURL ||
      "https://open-api.delcom.org/api/v1"
    }/${photo}`
      .replace(/\/+/g, "/")
      .replace("https:/", "https://");
  };

  const profilePhotoUrl = getPhotoUrl(profile?.photo);

  const profileImageStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #f093fb",
    boxShadow: "0 0 8px rgba(240, 147, 251, 0.6)",
  };

  const PRIMARY_COLOR = "#667eea";
  const LOGOUT_COLOR = "#dd2a7b";

  return (
    <>
      <style>
        {`
          .custom-navbar {
            background: linear-gradient(90deg, #515bd4 0%, #dd2a7b 100%) !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); 
            border-bottom: 3px solid #f093fb; 
            padding-top: 12px;
            padding-bottom: 12px;
            transition: all 0.3s ease;
          }
          .navbar-brand {
            font-size: 1.6rem;
            font-weight: 800;
            text-shadow: 1px 1px 5px rgba(0,0,0,0.3);
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
          }
          .navbar-brand:hover {
            opacity: 0.95;
            transform: scale(1.02);
            color: #fff !important;
          }
          .dropdown-menu {
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border: 1px solid #eee;
            padding: 10px 0;
            overflow: hidden;
            animation: dropdown-fade-in 0.3s ease-out;
          }
          @keyframes dropdown-fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .dropdown-item {
            color: #333;
            padding: 12px 20px;
            transition: all 0.2s ease;
            font-weight: 500;
          }
          .dropdown-item:hover {
            background-color: ${PRIMARY_COLOR}20;
            color: ${PRIMARY_COLOR};
            transform: translateX(5px);
          }
          .dropdown-item.text-danger:hover {
            background-color: ${LOGOUT_COLOR}20;
            color: ${LOGOUT_COLOR} !important;
            transform: translateX(5px);
          }
          .profile-dropdown-toggle {
            display: flex;
            align-items: center;
            padding: 10px 18px;
            border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            font-size: 1rem;
          }
          .profile-dropdown-toggle:hover {
            background-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
        `}
      </style>

      <nav className="navbar navbar-expand-md navbar-dark fixed-top custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "38px", height: "38px" }}
            />
            <span className="d-none d-sm-inline">Post</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            style={{ border: "none" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link text-white dropdown-toggle profile-dropdown-toggle"
                  href="#"
                  id="profileDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    className="me-2"
                    style={profileImageStyle}
                  />
                  <span style={{ fontWeight: 600 }}>
                    {profile?.name || "User"}
                  </span>
                </a>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person me-2"></i>Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="bi bi-cog me-2"></i>Settings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavbarComponent;

/*
 * Dokumentasi Kode
 *
 * NavbarComponent adalah komponen fungsional React yang merepresentasikan bilah navigasi (navbar) untuk aplikasi.
 * Komponen ini dirancang untuk menjadi bilah navigasi atas yang tetap (*fixed-top*) dan responsif (menggunakan Bootstrap).
 *
 * Dependencies:
 * - React
 * - Link dari "react-router-dom" untuk navigasi internal tanpa memuat ulang halaman.
 * - useNavigate dari "react-router-dom" (meskipun tidak digunakan secara langsung dalam JSX, tetap diimpor).
 *
 * Props:
 * - profile: Objek yang berisi data profil pengguna yang sedang login (setidaknya harus memiliki properti `photo` dan `name`).
 * - handleLogout: Fungsi callback yang akan dipanggil ketika tombol "Logout" diklik.
 *
 * Fungsi Pembantu:
 * 1. getPhotoUrl(photo):
 * - Fungsi ini menentukan URL foto profil yang benar.
 * - Jika `photo` kosong, mengembalikan `/user.png` (foto default).
 * - Jika `photo` sudah merupakan URL lengkap (dimulai dengan "http" atau "https"), mengembalikannya.
 * - Jika tidak, ia membuat URL lengkap dengan menggabungkan BASE_URL dari variabel lingkungan
 * (`REACT_APP_DELCOM_BASEURL` atau nilai default) dengan path foto, dan membersihkan slash ganda.
 *
 * Styling:
 * - `profileImageStyle`: Objek style inline untuk mengatur tampilan gambar profil (ukuran, bentuk lingkaran, border, dan shadow).
 * - `PRIMARY_COLOR` & `LOGOUT_COLOR`: Konstanta warna yang digunakan dalam CSS inline untuk konsistensi.
 * - Komponen menggunakan tag `<style>` dengan template literal untuk menyuntikkan CSS kustom ke dalam dokumen.
 * - CSS kustom memberikan gaya gradien latar belakang yang menarik (`linear-gradient`) ke navbar, shadow, dan border bawah.
 * - Mengatur gaya untuk `navbar-brand` (logo), dan memberikan efek transisi/animasi pada elemen dropdown.
 *
 * Struktur JSX (Tampilan):
 * - Navbar adalah elemen `<nav>` dengan kelas Bootstrap `navbar navbar-expand-md navbar-dark fixed-top custom-navbar`.
 * - Brand (Logo): Berupa `<Link>` ke halaman utama (`/`) yang menampilkan gambar logo dan teks "Post".
 * - Toggler: Tombol untuk mengaktifkan/menonaktifkan menu pada tampilan mobile (`navbar-toggler`).
 * - Dropdown Menu Profil:
 * - Terletak di sisi kanan (`ms-auto`).
 * - Dropdown toggle menampilkan gambar profil pengguna (`profilePhotoUrl`) dengan gaya kustom, dan nama pengguna (`profile?.name`).
 * - Dropdown item berisi link:
 * - `<Link>` ke `/profile` (untuk melihat profil).
 * - `<Link>` ke `/settings` (untuk pengaturan).
 * - `<button>` untuk **Logout** yang memanggil fungsi `handleLogout` dari props.
 */
