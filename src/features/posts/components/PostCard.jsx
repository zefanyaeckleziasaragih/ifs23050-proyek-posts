// src/components/PostCard.jsx

import React from "react";
import { formatDate } from "../../../helpers/toolsHelper"; // Path ini sudah benar jika PostCard ada di src/components

function PostCard({ post, profile, onView, onEdit, onDelete }) {
  const { id, title, description, cover_url, created_at, is_finished } = post;

  // Asumsi profil memiliki properti username dan profile_picture_url
  // Jika profile_picture_url belum ada, akan menggunakan placeholder
  const username = profile?.username || "Pengguna";
  const profilePicture =
    profile?.profile_picture_url || "https://via.placeholder.com/50";

  // Mengambil deskripsi singkat
  const shortDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  return (
    // Perbesar tampilan: col-lg-6 col-md-8 sudah di HomePage, jadi ini akan mengatur lebar relatifnya
    // Untuk memperbesar isi card, kita akan memastikan gambar memakan sebagian besar ruang
    <div className="card shadow-sm mb-4 border rounded-3">
      {/* Header Post (User Info) */}
      <div className="card-header d-flex align-items-center bg-white border-bottom-0 p-3">
        {/* Gambar profil pengguna - pastikan profilePicture memiliki URL yang valid */}
        <img
          src={profilePicture}
          alt={username}
          className="rounded-circle me-3"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
        />
        <div className="flex-grow-1">
          <p className="fw-bold mb-0">{username}</p>
          <small className="text-muted">{formatDate(created_at)}</small>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-sm btn-light p-0"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={onView}>
                <i className="bi bi-eye me-2"></i> Lihat Detail
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={onEdit}>
                <i className="bi bi-pencil me-2"></i> Ubah
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={onDelete}>
                <i className="bi bi-trash me-2"></i> Hapus
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Gambar Postingan - Ini adalah bagian penting untuk memuat gambar */}
      {/* Pastikan `cover_url` dari API Anda adalah URL gambar yang valid dan dapat diakses */}
      <img
        src={cover_url || "https://via.placeholder.com/600x400?text=No+Image"}
        className="card-img-top"
        alt={title}
        // Mengurangi maxHeight agar gambar terlihat lebih besar jika ukurannya besar
        // dan objectFit agar gambar tidak terdistorsi
        style={{
          maxHeight: "600px",
          objectFit: "contain",
          backgroundColor: "#f0f0f0",
        }}
      />

      <div className="card-body p-3">
        {/* Aksi (Like/Comment - Hapus Tombol Share) */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex gap-3">
            <i className="bi bi-heart fs-4 cursor-pointer"></i>
            <i className="bi bi-chat fs-4 cursor-pointer"></i>
            {/* <i className="bi bi-send fs-4 cursor-pointer"></i> -- Dihapus */}
          </div>
          <div>
            <span className={`badge bg-${is_finished ? "success" : "warning"}`}>
              {is_finished ? "Selesai" : "Proses"}
            </span>
          </div>
        </div>

        {/* Deskripsi dan Judul */}
        <p className="card-text mb-1">
          <span className="fw-bold me-1">{username}</span>
          {shortDescription}
          {description.length > 100 && (
            <span className="text-muted cursor-pointer" onClick={onView}>
              {" "}
              ...lebih lanjut
            </span>
          )}
        </p>
        <small className="text-muted">ID Post: {id}</small>
      </div>
    </div>
  );
}

export default PostCard;
