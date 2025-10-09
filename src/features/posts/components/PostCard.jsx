import React, { useState, useEffect } from "react";
import { formatDate } from "../../../helpers/toolsHelper";
import { useNavigate } from "react-router-dom";
import { asyncLikePost } from "../states/action";
import { useDispatch } from "react-redux";

function PostCard({ post, profile, onView, onEdit, onDelete, currentUserId }) {
  const navigate = useNavigate();
  const { id, title, description, cover_url, created_at, is_finished } = post;
  const dispatch = useDispatch();

  // Initialize like state from post data
  const initialLikeCount = post.likes?.length || 0;
  const initialIsLiked = post.likes?.includes(profile?.id) || false;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // Check if current user is the post author
  const isOwnPost =
    post?.author?.id === profile?.id || post?.user_id === profile?.id;

  // Update like count and like status when post data changes
  useEffect(() => {
    setLikeCount(post.likes?.length || 0);
    setIsLiked(post.likes?.includes(profile?.id) || false);
  }, [post.likes, profile?.id]);

  const handleLike = () => {
    // Prevent liking own post
    if (isOwnPost) {
      console.log("Tidak dapat melakukan like pada postingan sendiri");
      return;
    }

    console.log("The current use id id:" + profile?.id);
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

  const username = post?.author?.name || "Pengguna";
  const profilePicture = profile?.photo || "https://via.placeholder.com/50";

  const shortDescription =
    description.length > 100
      ? description.substring(0, 100) + "..."
      : description;

  const handleCommentClick = () => {
    navigate(`/posts/${id}`);
  };

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
              <button className="dropdown-item" onClick={onEdit}>
                <i className="bi bi-pencil me-2"></i> Ubah
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            {(isOwnPost || String(post.user_id) === String(currentUserId)) && (
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={onDelete}
                >
                  <i className="bi bi-trash me-2"></i> Hapus
                </button>
              </li>
            )}
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
          {/* Tombol Like yang Toggable - Disabled untuk postingan sendiri */}
          <i
            className={`fs-4 ${isOwnPost ? "text-muted" : "cursor-pointer"} ${
              isLiked ? "bi bi-heart-fill text-danger" : "bi bi-heart"
            }`}
            onClick={handleLike}
            style={{
              cursor: isOwnPost ? "not-allowed" : "pointer",
              opacity: isOwnPost ? 0.5 : 1,
            }}
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
