// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import userApi from "../api/userApi";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper"; // PASTIKAN PATH INI SUDAH BENAR

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [form, setForm] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    password: "",
    new_password: "",
  });

  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Definisikan kembali konstanta CSS dari HomePage
  const PRIMARY_COLOR = "#667eea";

  // --- FUNGSI FETCH PROFILE, UPDATE, UPLOAD, CHANGE PASSWORD (TETAP SAMA) ---

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const user = await userApi.getProfile();
      setProfile(user);
      setForm({ name: user.name || "", email: user.email || "" });
    } catch (err) {
      console.error("fetchProfile error:", err);
      showErrorDialog(
        err.message || "Gagal memuat profil. Silakan login ulang."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      return showErrorDialog("Nama dan email tidak boleh kosong");
    }
    setIsUpdating(true);
    try {
      const updated = await userApi.putProfile(form.name, form.email);
      setProfile(updated);
      showSuccessDialog("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("updateProfile error:", err);
      showErrorDialog("Gagal memperbarui profil: " + (err.message || ""));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      await userApi.postProfilePhoto(file);
      showSuccessDialog("Foto profil berhasil diubah!");
      await fetchProfile();
      setPhotoPreview(null);
      e.target.value = "";
    } catch (err) {
      console.error("upload photo error:", err);
      showErrorDialog(
        "Gagal mengubah foto profil: " +
          (err.message || err.toString() || "Kesalahan jaringan.")
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.password || !passwords.new_password) {
      return showErrorDialog("Isi kedua field password");
    }
    try {
      await userApi.putProfilePassword(
        passwords.password,
        passwords.new_password
      );

      showSuccessDialog("Kata sandi berhasil diubah!");

      setPasswords({ password: "", new_password: "" });
    } catch (err) {
      console.error("change password error:", err);
      showErrorDialog("Gagal mengubah kata sandi: " + (err.message || ""));
    }
  };

  // --- END FUNGSI ---

  if (loading) return <div className="text-center mt-5">Memuat profil...</div>;

  // helper photo url
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

  return (
    <>
      {/* Style Global dari HomePage */}
      <style>
        {`
          /* Animasi float dihapus karena tidak lagi menggunakan latar belakang gradien/besar */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Custom style untuk konsistensi input focus */
          .home-input-focus:focus {
            border-color: ${PRIMARY_COLOR} !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .home-input-style {
            border-radius: 12px !important;
            padding: 12px 18px !important; 
            box-shadow: inset 0 1px 4px rgba(0,0,0,0.1);
            border: 2px solid #e0e0e0 !important;
            font-weight: 500;
          }
          
          /* Custom style untuk tombol Save (Gradient) */
          .home-btn-gradient {
            background: linear-gradient(135deg, #f58529 0%, #dd2a7b 100%);
            transition: all 0.3s ease;
            color: white;
            font-weight: 700;
            border-radius: 12px !important;
            padding: 0.75rem 0 !important;
            border: none;
          }
          .home-btn-gradient:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(245, 133, 41, 0.4);
          }
          .home-btn-gradient:active:not(:disabled) {
            transform: translateY(0);
          }
          
          /* Custom style untuk tombol Danger */
          .btn-danger-styled {
            background-color: #dc3545 !important;
            border-color: #dc3545 !important;
            border-radius: 12px !important;
            padding: 0.75rem 0 !important;
            font-weight: 700;
            transition: all 0.3s ease;
            box-shadow: 0 8px 15px rgba(220, 53, 69, 0.2);
          }
          .btn-danger-styled:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(220, 53, 69, 0.4);
          }
          .btn-danger-styled:active {
            transform: translateY(0);
          }

          /* Offset Sidebar */
          .ps-sidebar-offset {
            padding-left: 320px; 
            padding-right: 30px;
          }

          @media (max-width: 992px) {
            .ps-sidebar-offset {
              padding-left: 15px;
              padding-right: 15px;
            }
          }
        `}
      </style>

      {/* KONTEN UTAMA DENGAN LATAR BELAKANG PUTIH */}
      <div
        style={{
          // --- PERUBAHAN UTAMA DI SINI ---
          // Mengubah latar belakang menjadi putih solid
          background: "#f8f9fa", // Warna abu-abu terang, atau bisa "#fff" (putih murni)
          minHeight: "100%", // Mengganti 100vh agar tidak memaksakan tinggi
          // ------------------------------
          transition: "opacity 0.6s ease",
          opacity: fadeIn ? 1 : 0,
          paddingBottom: "50px", // Tambahkan padding agar ada ruang di bawah
        }}
      >
        {/* Lingkaran animasi latar belakang dihapus */}

        {/* Konten Utama */}
        <div
          className="main-content"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div
            className="container-fluid pt-5 pb-5"
            style={{ maxWidth: 800, margin: "0 auto", padding: "0 15px" }}
          >
            {/* Judul Halaman */}
            <h2
              className="fw-bold mb-5 text-dark text-center"
              style={{
                // Mengubah warna teks menjadi gelap
                fontSize: "2.5rem",

                animation: "fadeInUp 0.6s ease-out",
              }}
            >
              <i
                className="bi bi-person-circle"
                style={{ marginRight: 10, color: PRIMARY_COLOR }}
              ></i>
              Pengaturan Profil
            </h2>

            {/* Kontainer Card Utama (Hanya White Background) */}
            <div
              className="p-4 p-md-5"
              style={{
                // Menghilangkan backdropFilter karena background sudah putih
                background: "#fff",
                borderRadius: "24px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.1)", // Shadow dibuat lebih terang
                animation: "fadeInUp 0.6s ease-out 0.2s backwards",
                border: "1px solid #eee", // Border tipis agar terlihat batasnya
              }}
            >
              {/* Card Profil Utama */}
              <div className="mb-5 pb-4 border-bottom border-1 border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-4">
                  <div className="position-relative">
                    <img
                      src={
                        photoPreview ? photoPreview : getPhotoUrl(profile.photo)
                      }
                      alt="Profile"
                      className="rounded-circle shadow"
                      width="100"
                      height="100"
                      style={{
                        objectFit: "cover",
                        border: "4px solid #dd2a7b",
                        boxShadow: "0 0 0 5px rgba(221, 42, 123, 0.2)",
                        transition: "all 0.3s ease",
                      }}
                    />
                    <label
                      htmlFor="photoUpload"
                      className={`btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle ${
                        isUploading ? "disabled" : ""
                      }`}
                      style={{
                        transform: "translate(20%, 20%)",
                        cursor: isUploading ? "not-allowed" : "pointer",
                        boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                        color: PRIMARY_COLOR,
                      }}
                      title="Ubah Foto Profil"
                    >
                      <i className="bi bi-camera-fill"></i>
                    </label>
                    <input
                      id="photoUpload"
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleChangePhoto}
                    />
                  </div>

                  <div>
                    <h4 className="mb-1 fw-bold text-dark">{profile.name}</h4>
                    <p className="text-muted mb-0">{profile.email}</p>
                    <small className="text-secondary">
                      ID Pengguna: {profile.id}
                    </small>
                  </div>
                </div>
              </div>

              {/* Card Perbarui Profil */}
              <div className="mb-5">
                <h5 className="mb-4 fw-bold text-dark">
                  <i
                    className="bi bi-person-lines-fill me-2"
                    style={{ color: PRIMARY_COLOR }}
                  ></i>
                  Perbarui Data Diri
                </h5>
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className="form-control home-input-focus home-input-style"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control home-input-focus home-input-style"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn w-100 home-btn-gradient"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </form>
              </div>

              {/* Card Ganti Kata Sandi */}
              <div>
                <h5 className="mb-4 fw-bold text-danger">
                  <i className="bi bi-shield-lock-fill me-2"></i>
                  Ganti Kata Sandi
                </h5>
                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Kata Sandi Lama
                    </label>
                    <input
                      type="password"
                      className="form-control home-input-focus home-input-style"
                      value={passwords.password}
                      onChange={(e) =>
                        setPasswords({ ...passwords, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      className="form-control home-input-focus home-input-style"
                      value={passwords.new_password}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          new_password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button type="submit" className="btn w-100 btn-danger-styled">
                    Ubah Kata Sandi
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
