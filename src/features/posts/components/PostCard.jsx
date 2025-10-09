// PostCard.jsx
import React, { useState, useEffect } from "react";
import { formatDate } from "../../../helpers/toolsHelper";
import { useNavigate } from "react-router-dom";
import { asyncLikePost } from "../states/action";
import { useDispatch } from "react-redux";

function PostCard({ post, profile, onView, onEdit, onDelete, currentUserId }) {
  const navigate = useNavigate();
  // Destructuring diperbaiki untuk kompatibilitas post structure yang lebih baik
  const { id, description, cover, created_at } = post;
  const dispatch = useDispatch();

  // Inisialisasi state
  const initialLikeCount = post.likes?.length || 0;
  // Perlu diperiksa apakah 'likes' adalah array of IDs atau array of objects
  const initialIsLiked = post.likes?.includes(profile?.id) || false;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // Check if current user is the post author
  // Gunakan post.user atau post.author jika data user terpisah dari post
  const isOwnPost =
    post?.user?.id === profile?.id ||
    post?.author?.id === profile?.id ||
    String(post?.user_id) === String(profile?.id);

  // Update like count and like status when post data changes
  useEffect(() => {
    setLikeCount(post.likes?.length || 0);
    // Asumsi post.likes adalah array of user IDs
    setIsLiked(post.likes?.includes(profile?.id) || false);
  }, [post.likes, profile?.id]);

  const handleLike = () => {
    // Prevent liking own post
    if (isOwnPost) {
      console.log("Tidak dapat melakukan like pada postingan sendiri");
      return;
    }

    if (isLiked) {
      // Unlike
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      dispatch(asyncLikePost(id, 0));
    } else {
      // Like
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      dispatch(asyncLikePost(id, 1));
    }
  };

  // Ambil info dari struktur yang benar
  const username = post?.user?.name || post?.author?.name || "Pengguna Anonim";
  // Gunakan placeholder default yang lebih baik jika profile.photo tidak ada
  const profilePicture =
    post?.user?.photo || post?.author?.photo || "/user.png";

  const shortDescription =
    description && description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  const handleCommentClick = () => {
    navigate(`/posts/${id}`);
  };

  return (
    <>
      <style>
        {`
          .modern-card {
            border: 1px solid #f0f0f0;
            border-radius: 18px; /* Lebih bulat */
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); /* Shadow yang lebih dalam tapi halus */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .modern-card:hover {
             transform: translateY(-2px);
             box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
          }
          .post-header {
            padding: 15px 20px;
          }
          .post-image {
            max-height: 500px !important;
            object-fit: cover !important; /* Gunakan cover agar gambar terlihat bagus di semua ukuran */
            background-color: #f7f7f7;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
          }
          .post-actions i {
            font-size: 1.8rem; /* Ikon lebih besar */
            transition: color 0.2s ease, transform 0.2s ease;
          }
          .post-actions .bi-heart:hover {
            color: #ff3838;
            transform: scale(1.1);
          }
          .post-actions .bi-chat:hover {
            color: #515bd4;
            transform: scale(1.1);
          }
          .profile-avatar {
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
          }
        `}
      </style>

      {/* Kartu Postingan Modern */}
      <div className="card modern-card mb-4">
        {/* Header Post (User Info) */}
        <div className="d-flex align-items-center bg-white post-header">
          <img
            src={profilePicture}
            alt={username}
            className="rounded-circle me-3 profile-avatar"
            style={{ width: "45px", height: "45px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/user.png";
            }} // Fallback jika gambar rusak
          />
          <div className="flex-grow-1">
            <p
              className="fw-bold mb-0"
              style={{ fontSize: "1.1rem", color: "#222" }}
            >
              {username}
            </p>
            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
              {formatDate(created_at)}
            </small>
          </div>

          <div className="dropdown">
            {isOwnPost && (
              <button
                className="btn btn-sm text-dark p-1"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: "transparent", border: "none" }}
              >
                <i className="bi bi-three-dots-vertical fs-5"></i>
              </button>
            )}

            {/* Dropdown hanya muncul jika isOwnPost true */}
            {isOwnPost && (
              <ul
                className="dropdown-menu dropdown-menu-end shadow border-0"
                style={{ borderRadius: 10 }}
              >
                {onEdit && (
                  <li>
                    <button className="dropdown-item" onClick={onEdit}>
                      <i className="bi bi-pencil me-2"></i> Ubah Postingan
                    </button>
                  </li>
                )}
                {onEdit && onDelete && (
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                )}
                {onDelete && (
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={onDelete}
                    >
                      <i className="bi bi-trash me-2"></i> Hapus Postingan
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Gambar Postingan */}
        <img
          src={
            post.cover ||
            "https://via.placeholder.com/600x400?text=Gambar+Tidak+Tersedia"
          }
          className="card-img-top post-image"
          alt={description}
        />

        <div className="card-body p-4">
          {/* Aksi (Like & Comment) */}
          <div className="d-flex justify-content-start gap-3 mb-2 post-actions">
            {/* Tombol Like */}
            <i
              className={` ${isOwnPost ? "text-muted" : "cursor-pointer"} ${
                isLiked ? "bi bi-heart-fill text-danger" : "bi bi-heart"
              }`}
              onClick={handleLike}
              style={{
                cursor: isOwnPost ? "not-allowed" : "pointer",
                opacity: isOwnPost ? 0.7 : 1,
                fontSize: "1.8rem",
              }}
              title={isOwnPost ? "Tidak dapat menyukai postingan sendiri" : ""}
            ></i>

            {/* Ikon Komentar */}
            <i
              className="bi bi-chat-dots cursor-pointer text-dark"
              onClick={handleCommentClick}
              style={{ fontSize: "1.8rem", cursor: "pointer" }}
              title="Lihat Komentar"
            ></i>
          </div>

          {/* Like Count */}
          <p className="fw-bold mb-2" style={{ color: "#333" }}>
            {likeCount} Suka
          </p>

          {/* Deskripsi */}
          <p className="card-text mb-1" style={{ fontSize: "1rem" }}>
            <span className="fw-bold me-1" style={{ color: "#222" }}>
              {username}
            </span>
            {shortDescription}
            {description && description.length > 100 && (
              <span
                className="text-primary cursor-pointer fw-bold"
                onClick={onView}
                style={{ cursor: "pointer" }}
              >
                {" "}
                ...lebih lanjut
              </span>
            )}
          </p>
          {/* <small className="text-muted d-block mt-2">ID Post: {id}</small> */}
        </div>
      </div>
    </>
  );
}

export default PostCard;
