// NavbarComponent.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavbarComponent({ profile, handleLogout }) {
  const navigate = useNavigate();

  // Helper function untuk mendapatkan URL foto (Disalin dari ProfilePage)
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

  // Ambil URL foto profil yang benar
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
                    {/* ✅ PERUBAHAN UTAMA: Mengubah <a> menjadi <Link> dan menetapkan path ke /settings */}
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
