// NavbarComponent.jsx
import React from "react";
// Pastikan Anda mengimpor 'profile' dan 'handleLogout'
// Jika komponen ini tidak menerima 'profile' dan 'handleLogout' sebagai props, pastikan untuk menyesuaikannya.

function NavbarComponent({ profile, handleLogout }) {
  // Tambahkan style untuk profile image jika belum ada di CSS global
  const profileImageStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff", // Border putih halus
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  };

  return (
    <>
      {/* Tambahkan Style CSS untuk Navbar */}
      <style>
        {`
          .custom-navbar {
            /* Gradient yang lebih halus dan modern */
            background: linear-gradient(90deg, #515bd4 0%, #dd2a7b 100%) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            border-bottom: 3px solid #f093fb; /* Aksen warna cerah di bawah */
            padding-top: 10px;
            padding-bottom: 10px;
          }
          .navbar-brand {
            font-size: 1.5rem;
            font-weight: 700;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          .navbar-brand:hover {
            opacity: 0.9;
            transform: scale(1.01);
          }
          .dropdown-menu {
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            border: none;
            padding: 10px 0;
          }
          .dropdown-item {
            color: #333;
            padding: 10px 20px;
            transition: all 0.2s ease;
          }
          .dropdown-item:hover {
            background-color: #f5f5f5;
            color: #dd2a7b; /* Warna aksen saat hover */
          }
          .profile-dropdown-toggle {
             display: flex;
             align-items: center;
             padding: 8px 15px;
             border-radius: 15px;
             transition: all 0.3s ease;
          }
          .profile-dropdown-toggle:hover {
             background-color: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <nav className="navbar navbar-expand-md navbar-dark fixed-top custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <img
              src="/logo.png"
              alt="Logo"
              style={{ width: "36px", height: "36px" }}
            />
            Post
          </a>
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
                  {/* Gunakan style profile image yang sudah diperbaiki */}
                  <img
                    src="/user.png"
                    alt="Profile"
                    className="me-2"
                    style={profileImageStyle}
                  />
                  {/* Pastikan profile.name ada sebelum ditampilkan */}
                  <span style={{ fontWeight: 600 }}>
                    {profile?.name || "User"}
                  </span>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-person me-2"></i>Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <i className="bi bi-cog me-2"></i>Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger" // Warna merah untuk tombol logout
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
