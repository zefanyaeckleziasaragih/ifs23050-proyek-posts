import React, { useState } from "react";
import { formatDate } from "../../../helpers/toolsHelper";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function PostCard({ post, profile, onView, onEdit, onDelete }) {
  const navigate = useNavigate(); // Use useNavigate hook
  const { id, title, description, cover_url, created_at, is_finished } = post;

  // State baru untuk Like
  // Asumsi data post tidak memiliki is_liked atau like_count dari API untuk demo
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
  };

  const handleLike = () => {
    if (isLiked) {
      dispatch(asyncLikePost(id, 0)); // Unlike
      return;
    }
    dispatch(asyncLikePost(id, 1)); // Like
  };

  const username = post?.author.name || "Pengguna";
  const profilePicture = profile?.photo || "https://via.placeholder.com/50";

  const shortDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  const handleCommentClick = () => {
    // Navigasi ke halaman komentar yang baru dibuat
    navigate(`/posts/${id}/comments`);
  };

  // --- Tampilan PostCard ---
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

      {/* Gambar Postingan */}
      <img
        src={post.cover || "https://via.placeholder.com/600x400?text=No+Image"}
        className="card-img-top"
        alt={title}
        style={{
          maxHeight: "600px",
          objectFit: "contain",
          backgroundColor: "#f0f0f0",
        }}
      />

      <div className="card-body p-3">
        {/* Aksi (Like Toggable & Comment Link) */}
        <div className="d-flex justify-content-start gap-3 mb-2">
          {/* Tombol Like yang Toggable */}
          <i
            className={`fs-4 cursor-pointer ${
              isLiked ? "bi bi-heart-fill text-danger" : "bi bi-heart"
            }`}
            onClick={handleLike}
          ></i>

          {/* Ikon Komentar yang navigasi ke CommentPage */}
          <i
            className="bi bi-chat fs-4 cursor-pointer"
            onClick={handleCommentClick}
          ></i>
        </div>

        {/* Like Count */}
        <p className="fw-bold mb-1">{likeCount} Suka</p>

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
