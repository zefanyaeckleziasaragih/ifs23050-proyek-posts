// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import userApi from "../api/userApi";
// Asumsi path: sesuaikan path ke toolsHelper jika berbeda
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";

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

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const user = await userApi.getProfile();
      setProfile(user);
      setForm({ name: user.name || "", email: user.email || "" });
    } catch (err) {
      console.error("fetchProfile error:", err);
      alert(err.message || "Gagal memuat profil. Silakan login ulang.");
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
      return alert("Nama dan email tidak boleh kosong");
    }
    setIsUpdating(true);
    try {
      const updated = await userApi.putProfile(form.name, form.email);
      setProfile(updated);
      // Mengganti alert() dengan dialog kustom
      showSuccessDialog("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("updateProfile error:", err);
      alert("Gagal memperbarui profil: " + (err.message || ""));
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
      // Panggilan API ke userApi.postProfilePhoto(file)
      await userApi.postProfilePhoto(file);

      // Mengganti alert() dengan dialog kustom
      showSuccessDialog("Foto profil berhasil diubah!");

      await fetchProfile(); // re-fetch profile agar foto terbaru muncul
      setPhotoPreview(null);
      e.target.value = "";
    } catch (err) {
      console.error("upload photo error:", err);
      // Pertahankan alert untuk pesan error
      alert(
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
      return alert("Isi kedua field password");
    }
    try {
      await userApi.putProfilePassword(
        passwords.password,
        passwords.new_password
      );

      // Mengganti alert() dengan dialog kustom
      showSuccessDialog("Kata sandi berhasil diubah!");

      setPasswords({ password: "", new_password: "" });
    } catch (err) {
      console.error("change password error:", err);
      alert("Gagal mengubah kata sandi: " + (err.message || ""));
    }
  };

  if (loading) return <div className="text-center mt-5">Memuat profil...</div>;

  // helper photo url
  const getPhotoUrl = (photo) => {
    if (!photo) return "/user.png";
    if (photo.startsWith("http") || photo.startsWith("https")) return photo;
    // server returns relative path like "img/profile/3.png"
    return `${
      process.env.REACT_APP_DELCOM_BASEURL ||
      "https://open-api.delcom.org/api/v1"
    }/${photo}`
      .replace(/\/+/g, "/")
      .replace("https:/", "https://");
  };

  return (
    <div className="container-fluid py-5">
      {/* Tambahkan Style CSS untuk offset sidebar */}
      <style>
        {`
          /* Class kustom untuk mengimbangi lebar Sidebar (280px + margin) */
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

      {/* Kontainer utama konten dengan offset sidebar */}
      <div className="ps-sidebar-offset">
        <h2 className="fw-bold mb-4 text-center">Profil Pengguna</h2>

        {/* Card Profil Utama */}
        <div className="card shadow-lg p-4 mb-5 border-0 rounded-4">
          <div className="d-flex align-items-center gap-4">
            <div className="position-relative">
              <img
                src={photoPreview ? photoPreview : getPhotoUrl(profile.photo)}
                alt="Profile"
                className="rounded-circle shadow"
                width="120"
                height="120"
                style={{ objectFit: "cover", border: "3px solid #f093fb" }}
              />
              <label
                htmlFor="photoUpload"
                className={`btn btn-sm btn-outline-primary position-absolute bottom-0 end-0 rounded-circle ${
                  isUploading ? "disabled" : ""
                }`}
                style={{
                  transform: "translate(20%, -20%)",
                  cursor: isUploading ? "not-allowed" : "pointer",
                }}
              >
                <i className="bi bi-camera"></i>
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
              <h4 className="mb-1">{profile.name}</h4>
              <p className="text-muted mb-0">{profile.email}</p>
              <small className="text-secondary">
                ID Pengguna: {profile.id}
              </small>
            </div>
          </div>
        </div>

        {/* Card Perbarui Profil */}
        <div className="card shadow p-4 mb-4 border-0 rounded-4">
          <h5 className="mb-3 fw-bold">Perbarui Profil</h5>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control rounded-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-3 px-4"
              disabled={isUpdating}
            >
              {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        {/* Card Ganti Kata Sandi */}
        <div className="card shadow p-4 border-0 rounded-4">
          <h5 className="mb-3 fw-bold text-danger">Ganti Kata Sandi</h5>
          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label">Kata Sandi Lama</label>
              <input
                type="password"
                className="form-control rounded-3"
                value={passwords.password}
                onChange={(e) =>
                  setPasswords({ ...passwords, password: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Kata Sandi Baru</label>
              <input
                type="password"
                className="form-control rounded-3"
                value={passwords.new_password}
                onChange={(e) =>
                  setPasswords({ ...passwords, new_password: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-danger rounded-3 px-4">
              Ubah Kata Sandi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
