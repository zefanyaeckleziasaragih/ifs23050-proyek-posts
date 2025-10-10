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
  // Asumsi post.likes berisi array of user IDs
  const initialIsLiked = post.likes?.includes(profile?.id) || false;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // Check if current user is the post author
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
    description && description.length > 150 // Perpanjang sedikit deskripsi singkat
      ? description.substring(0, 150) + "..."
      : description;

  const handleCommentClick = () => {
    navigate(`/posts/${id}`);
  };

  // ===============================================
  // START: Aesthetic Enhancements (PENYESUAIAN FONT USERNAME CAPTION & ICON KOMENTAR)
  // ===============================================
  const ACCENT_GRADIENT_PINK =
    "linear-gradient(45deg, #f5576c 0%, #f093fb 100%)";
  const LIKE_ICON_COLOR = "#FF4500";
  const COMMENT_ICON_COLOR = "#007bff";
  const TEXT_PRIMARY_DARK = "#2c3e50";
  const TEXT_SECONDARY_LIGHT = "#7f8c8d";
  const PRIMARY_COLOR_BLUE = "#007bff";

  const FONT_SIZE_USERNAME_HEADER = "1.25rem"; // Username di header tetap besar
  const FONT_SIZE_USERNAME_CAPTION = "1.1rem"; // **PERUBAHAN: Dikecilkan dari 1.25rem**
  const FONT_WEIGHT_USERNAME = 800; // **PERUBAHAN: Boldness tetap 800**

  const cardStyle = {
    border: "none",
    borderRadius: 25,
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
    transition:
      "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  };

  const headerStyle = {
    padding: "20px 25px",
    backgroundColor: "#fcfcfc",
    borderBottom: "none",
    alignItems: "center",
  };

  const profileAvatarStyle = {
    width: "55px",
    height: "55px",
    objectFit: "cover",
    border: `3px solid ${ACCENT_GRADIENT_PINK.split("0%,")[0]
      .replace("linear-gradient(45deg, ", "")
      .trim()}`,
    boxShadow: "0 0 12px rgba(245, 87, 108, 0.4)",
    padding: "2px",
  };

  const usernameStyle = {
    fontSize: FONT_SIZE_USERNAME_HEADER,
    fontWeight: FONT_WEIGHT_USERNAME,
    color: TEXT_PRIMARY_DARK,
    marginBottom: "2px",
  };

  const timestampStyle = {
    fontSize: "0.9rem",
    color: TEXT_SECONDARY_LIGHT,
    fontWeight: 500,
  };

  const threeDotsButtonStyle = {
    background: "transparent",
    border: "none",
    color: TEXT_SECONDARY_LIGHT,
    fontSize: "1.5rem",
    padding: "5px",
    borderRadius: "50%",
    transition: "background-color 0.3s ease",
  };

  const dropdownMenuStyle = {
    borderRadius: 15,
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    border: "none",
  };

  // START PERUBAHAN UTAMA: Menghapus maxHeight dan minHeight dan mengubah objectFit
  const imageStyle = {
    width: "100%",
    // maxHeight: "700px", // DIHAPUS
    // minHeight: "300px", // DIHAPUS
    objectFit: "contain", // DIUBAH: Menggunakan 'contain' agar gambar menyesuaikan diri tanpa terpotong
    backgroundColor: "#f0f2f5",
    borderBottom: "none",
  };
  // END PERUBAHAN UTAMA

  const postActionsContainerStyle = {
    paddingTop: "12px",
    paddingBottom: "8px",
    borderBottom: "none",
    marginBottom: "0px",
    paddingLeft: "25px",
    paddingRight: "25px",
    gap: "1rem",
  };

  const iconBaseStyle = {
    fontSize: "2.1rem",
    transition: "transform 0.2s ease, color 0.2s ease",
  };

  const likeIconDynamicStyle = {
    ...iconBaseStyle,
    cursor: isOwnPost ? "not-allowed" : "pointer",
    opacity: isOwnPost ? 0.6 : 1,
    color: isLiked ? LIKE_ICON_COLOR : TEXT_SECONDARY_LIGHT,
  };

  const commentIconDynamicStyle = {
    ...iconBaseStyle,
    cursor: "pointer",
    // **PERUBAHAN: Warna default ikon komentar lebih muted (TEXT_SECONDARY_LIGHT)**
    color: COMMENT_ICON_COLOR,
  };

  const likeCountStyle = {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: TEXT_PRIMARY_DARK,
    marginBottom: "4px", // **PERUBAHAN: Dikecilkan dari 8px agar caption lebih dekat**
    paddingLeft: "25px",
    paddingRight: "25px",
  };

  const descriptionTextStyle = {
    fontSize: "1.05rem",
    lineHeight: 1.7,
    color: TEXT_PRIMARY_DARK,
  };

  const usernameDescriptionStyle = {
    fontSize: FONT_SIZE_USERNAME_CAPTION, // **PERUBAHAN DISINI (Dikecilkan)**
    fontWeight: FONT_WEIGHT_USERNAME, // **PERUBAHAN DISINI (BOLD TETAP)**
    color: TEXT_PRIMARY_DARK,
  };

  const readMoreLinkStyle = {
    cursor: "pointer",
    fontWeight: 700,
    color: ACCENT_GRADIENT_PINK.split("0%,")[0]
      .replace("linear-gradient(45deg, ", "")
      .trim(),
    transition: "color 0.2s ease",
  };
  // ===============================================
  // END: Aesthetic Enhancements
  // ===============================================

  return (
    <div className="card post-card-fancy" style={cardStyle}>
      {/* Header Post (User Info) */}
      <div
        className="d-flex justify-content-between post-header"
        style={headerStyle}
      >
        <div className="d-flex align-items-center">
          <img
            src={profilePicture}
            alt={username}
            className="rounded-circle me-3 profile-avatar"
            style={profileAvatarStyle}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/user.png";
            }}
          />
          <div>
            <p className="mb-0" style={usernameStyle}>
              {username}
            </p>
            <small style={timestampStyle}>
              <i className="bi bi-clock me-1"></i> {formatDate(created_at)}
            </small>
          </div>
        </div>

        <div className="dropdown">
          {isOwnPost && (
            <button
              className="btn btn-sm"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={threeDotsButtonStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f2f5")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <i className="bi bi-three-dots"></i>{" "}
            </button>
          )}

          {isOwnPost && (
            <ul
              className="dropdown-menu dropdown-menu-end"
              style={dropdownMenuStyle}
            >
              {onEdit && (
                <li>
                  <button className="dropdown-item" onClick={onEdit}>
                    <i className="bi bi-pencil-square me-2 text-primary"></i>{" "}
                    Ubah Postingan
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
                    <i className="bi bi-trash-fill me-2"></i> Hapus Postingan
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Gambar Postingan */}
      <div className="post-image-container">
        <img
          src={
            post.cover ||
            "https://via.placeholder.com/1200x800/e0e0e0/ffffff?text=Gambar+Tidak+Tersedia"
          }
          className="card-img-top post-image"
          alt={description}
          style={imageStyle}
        />
      </div>

      <div className="card-body p-0 pt-3">
        {/* Aksi (Like & Comment) */}
        <div
          className="d-flex justify-content-start align-items-center post-actions"
          style={postActionsContainerStyle}
        >
          {/* Tombol Like */}
          <i
            className={`
              ${isLiked ? "bi bi-heart-fill" : "bi bi-heart"}
              ${isOwnPost ? "" : "cursor-pointer"}
            `}
            onClick={handleLike}
            style={likeIconDynamicStyle}
            title={isOwnPost ? "Tidak dapat menyukai postingan sendiri" : ""}
            onMouseOver={(e) => {
              if (!isOwnPost) e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.color = LIKE_ICON_COLOR; // Warna selalu merah saat hover
            }}
            onMouseOut={(e) => {
              if (!isOwnPost) e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = isLiked
                ? LIKE_ICON_COLOR
                : TEXT_SECONDARY_LIGHT;
            }}
          ></i>

          {/* Ikon Komentar - **PERUBAHAN: Menggunakan ikon outline** */}
          <i
            className="bi bi-chat-text cursor-pointer" // Menggunakan bi-chat-text (outline)
            onClick={handleCommentClick}
            style={commentIconDynamicStyle}
            title="Lihat Komentar"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.color = PRIMARY_COLOR_BLUE; // Warna biru saat hover
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = COMMENT_ICON_COLOR;
            }}
          ></i>
        </div>

        {/* Like Count */}
        <p className="fw-bold mb-3" style={likeCountStyle}>
          <span style={{ color: LIKE_ICON_COLOR, marginRight: "3px" }}>
            {likeCount}
          </span>{" "}
          Suka
        </p>

        {/* Deskripsi - **PERUBAHAN: Padding bawah di div agar caption naik** */}
        <div style={{ padding: "0 25px 25px 25px" }}>
          <p className="card-text mb-1" style={descriptionTextStyle}>
            {/* Username di Deskripsi */}
            <span className="me-2" style={usernameDescriptionStyle}>
              {username}
            </span>
            {shortDescription}
            {description && description.length > 150 && (
              <span
                className="read-more-link"
                onClick={onView}
                style={readMoreLinkStyle}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = ACCENT_GRADIENT_PINK.split(
                    "0%,"
                  )[1]
                    .replace("100%)", "")
                    .trim())
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = ACCENT_GRADIENT_PINK.split(
                    "0%,"
                  )[0]
                    .replace("linear-gradient(45deg, ", "")
                    .trim())
                }
              >
                {" "}
                ...lebih lanjut
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
