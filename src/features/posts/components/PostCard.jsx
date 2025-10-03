// src/components/PostCard.jsx

import React from "react";
import { formatDate } from "../../../helpers/toolsHelper"; // Path ini sudah benar

function PostCard({ post, profile, onView, onEdit, onDelete }) {
  const { id, title, description, cover_url, created_at, is_finished } = post;

  const username = profile?.username || "Pengguna";
  const profilePicture =
    profile?.profile_picture_url || "https://via.placeholder.com/50";

  const shortDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  // Variabel statusBadge dihilangkan karena tidak digunakan

  return (
    <div className="card shadow-sm mb-4 border rounded-3">
      {/* Header Post (User Info) */}
      <div className="card-header d-flex align-items-center bg-white border-bottom-0 p-3">
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

        {/* Badge Status telah dihapus dari sini */}
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
            {/* OPSI: Tambahkan status di sini jika perlu. Jika tidak, biarkan daftar aksi saja. */}
            <li>
              <span className="dropdown-item fw-bold text-muted">
                Status: {is_finished ? "Selesai" : "Proses"}
              </span>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
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

      {/* Gambar Postingan */}
      <img
        src={cover_url || "https://via.placeholder.com/600x400?text=No+Image"}
        className="card-img-top"
        alt={title}
        style={{
          maxHeight: "600px",
          objectFit: "contain",
          backgroundColor: "#f0f0f0",
        }}
      />

      <div className="card-body p-3">
        {/* Aksi (Hanya Like/Comment) */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          {/* Ikon share (pesawat kertas) telah dihapus */}
          <div className="d-flex gap-3">
            <i className="bi bi-heart fs-4 cursor-pointer"></i>
            <i className="bi bi-chat fs-4 cursor-pointer"></i>
          </div>

          {/* Badge status yang ada di pojok kanan bawah ikon interaksi telah dihapus */}
        </div>

        {/* Deskripsi */}
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
