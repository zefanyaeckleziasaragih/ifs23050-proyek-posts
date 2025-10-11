import React, { useState, useEffect } from "react";
import { formatDate } from "../../../helpers/toolsHelper";
import { useNavigate } from "react-router-dom";
import { asyncLikePost } from "../states/action";
import { useDispatch } from "react-redux";

function PostCard({ post, profile, onView, onEdit, onDelete, currentUserId }) {
  const navigate = useNavigate();
  const { id, description, cover, created_at } = post;
  const dispatch = useDispatch();

  const initialLikeCount = post.likes?.length || 0;
  const initialIsLiked = post.likes?.includes(profile?.id) || false;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const isOwnPost =
    post?.user?.id === profile?.id ||
    post?.author?.id === profile?.id ||
    String(post?.user_id) === String(profile?.id);

  useEffect(() => {
    setLikeCount(post.likes?.length || 0);
    setIsLiked(post.likes?.includes(profile?.id) || false);
  }, [post.likes, profile?.id]);

  const handleLike = () => {
    if (isOwnPost) {
      console.log("Tidak dapat melakukan like pada postingan sendiri");
      return;
    }

    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      dispatch(asyncLikePost(id, 0));
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      dispatch(asyncLikePost(id, 1));
    }
  };

  const username = post?.user?.name || post?.author?.name || "Pengguna Anonim";
  const profilePicture =
    post?.user?.photo || post?.author?.photo || "/user.png";

  const shortDescription =
    description && description.length > 150
      ? description.substring(0, 150) + "..."
      : description;

  const handleCommentClick = () => {
    navigate(`/posts/${id}`);
  };

  const ACCENT_GRADIENT_PINK =
    "linear-gradient(45deg, #f5576c 0%, #f093fb 100%)";
  const LIKE_ICON_COLOR = "#FF4500";
  const COMMENT_ICON_COLOR = "#007bff";
  const TEXT_PRIMARY_DARK = "#2c3e50";
  const TEXT_SECONDARY_LIGHT = "#7f8c8d";
  const PRIMARY_COLOR_BLUE = "#007bff";

  const FONT_SIZE_USERNAME_HEADER = "1.25rem";
  const FONT_SIZE_USERNAME_CAPTION = "1.1rem";
  const FONT_WEIGHT_USERNAME = 800;

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

  const imageStyle = {
    width: "100%",
    objectFit: "contain",
    backgroundColor: "#f0f2f5",
    borderBottom: "none",
  };

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
    color: COMMENT_ICON_COLOR,
  };

  const likeCountStyle = {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: TEXT_PRIMARY_DARK,
    marginBottom: "4px",
    paddingLeft: "25px",
    paddingRight: "25px",
  };

  const descriptionTextStyle = {
    fontSize: "1.05rem",
    lineHeight: 1.7,
    color: TEXT_PRIMARY_DARK,
  };

  const usernameDescriptionStyle = {
    fontSize: FONT_SIZE_USERNAME_CAPTION,
    fontWeight: FONT_WEIGHT_USERNAME,
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

  return (
    <div className="card post-card-fancy" style={cardStyle}>
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
              <i className="bi bi-three-dots"></i>
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
                    <i className="bi bi-pencil-square me-2 text-primary"></i>
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
        <div
          className="d-flex justify-content-start align-items-center post-actions"
          style={postActionsContainerStyle}
        >
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
              e.currentTarget.style.color = LIKE_ICON_COLOR;
            }}
            onMouseOut={(e) => {
              if (!isOwnPost) e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = isLiked
                ? LIKE_ICON_COLOR
                : TEXT_SECONDARY_LIGHT;
            }}
          ></i>

          <i
            className="bi bi-chat-text cursor-pointer"
            onClick={handleCommentClick}
            style={commentIconDynamicStyle}
            title="Lihat Komentar"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.color = PRIMARY_COLOR_BLUE;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = COMMENT_ICON_COLOR;
            }}
          ></i>
        </div>

        <p className="fw-bold mb-3" style={likeCountStyle}>
          <span style={{ color: LIKE_ICON_COLOR, marginRight: "3px" }}>
            {likeCount}
          </span>
          Suka
        </p>

        <div style={{ padding: "0 25px 25px 25px" }}>
          <p className="card-text mb-1" style={descriptionTextStyle}>
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

/*
 * Dokumentasi Kode
 *
 * PostCard adalah komponen fungsional React yang merepresentasikan tampilan satu kiriman (post) dalam bentuk kartu yang estetik (fancy card).
 * Komponen ini menangani tampilan data post, interaksi seperti Like, dan menu opsi (Edit/Hapus) untuk post milik pengguna sendiri.
 *
 * Dependencies:
 * - React, useState, useEffect: Hook standar React.
 * - formatDate: Fungsi helper untuk memformat tanggal.
 * - useNavigate: Hook dari react-router-dom untuk navigasi.
 * - asyncLikePost: Action Redux untuk mengirimkan permintaan like/unlike ke API.
 * - useDispatch: Hook Redux untuk mendapatkan fungsi dispatch.
 *
 * Props:
 * - post: Objek data kiriman, harus mencakup `id`, `description`, `cover`, `created_at`, `user` (atau `author`), dan `likes`.
 * - profile: Objek data profil pengguna yang sedang login (digunakan untuk menentukan apakah post sudah disukai dan untuk otorisasi).
 * - onView: Fungsi callback yang dipanggil ketika link "lebih lanjut" diklik (biasanya untuk melihat detail post).
 * - onEdit: Fungsi callback yang dipanggil ketika tombol "Ubah Postingan" diklik.
 * - onDelete: Fungsi callback yang dipanggil ketika tombol "Hapus Postingan" diklik.
 * - currentUserId: (Dideklarasikan tetapi tidak digunakan secara eksplisit, otorisasi diurus oleh `profile?.id`).
 *
 * State Lokal:
 * - isLiked: Boolean, menunjukkan apakah post saat ini disukai oleh pengguna yang sedang login.
 * - likeCount: Integer, jumlah total suka pada post.
 *
 * Logic:
 * 1. Otorisasi (`isOwnPost`): Menentukan apakah post ini milik pengguna yang sedang login, dengan memeriksa `post.user.id`, `post.author.id`, atau `post.user_id` terhadap `profile.id`.
 * 2. `useEffect`: Memastikan `isLiked` dan `likeCount` diperbarui setiap kali data post (`post.likes`) atau profil pengguna berubah.
 * 3. `handleLike`: Menangani logika Like/Unlike secara lokal (mengubah state `isLiked` dan `likeCount`) dan mengirimkan action Redux (`asyncLikePost`) untuk memperbarui status di backend. Like pada postingan sendiri dicegah.
 * 4. `handleCommentClick`: Mengarahkan pengguna ke halaman detail post (`/posts/{id}`) yang biasanya juga tempat untuk melihat/menambah komentar.
 * 5. Deskripsi: Memotong deskripsi jika lebih panjang dari 150 karakter dan menambahkan link "lebih lanjut" yang memicu prop `onView`.
 *
 * Styling:
 * - Sejumlah konstanta digunakan untuk warna dan ukuran font untuk memberikan estetika yang konsisten.
 * - Menggunakan style inline untuk mengatur tampilan kartu yang modern (`cardStyle`), avatar profil (`profileAvatarStyle`), dan ikon interaksi.
 * - Gambar post menggunakan `objectFit: "contain"` untuk memastikan seluruh gambar terlihat di dalam container tanpa terpotong (perubahan utama dari kode asli).
 * - Ikon Like dan Komentar memiliki efek hover yang halus (`scale(1.15)`).
 * - Ikon Komentar menggunakan varian *outline* (`bi-chat-text`).
 * - Jumlah like ditampilkan dengan penekanan warna merah oranye (`LIKE_ICON_COLOR`).
 */
