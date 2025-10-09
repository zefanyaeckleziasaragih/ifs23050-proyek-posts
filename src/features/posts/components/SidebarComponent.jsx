// SidebarComponent.jsx
import { NavLink, useLocation } from "react-router-dom";
import React from "react";

function SidebarComponent() {
  const location = useLocation(); // Gunakan useLocation untuk mendapatkan path aktif

  return (
    <>
      {/* Tambahkan Style CSS untuk Sidebar */}
      <style>
        {`
          .sidebar {
            width: 250px;
            background: #ffffff; /* Background default putih bersih */
            border-right: 1px solid #f0f0f0; /* Garis pemisah halus */
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05); /* Shadow tipis */
            transition: all 0.3s ease;
          }
          
          /* Style untuk NavLink default */
          .sidebar .nav-link {
            padding: 12px 15px;
            margin-bottom: 8px;
            border-radius: 12px; /* Lebih rounded */
            color: #555;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          /* Hover effect */
          .sidebar .nav-link:hover {
            background-color: #f7f7f7;
            color: #dd2a7b; /* Warna aksen saat hover */
            transform: translateX(3px);
          }

          /* Style untuk NavLink yang aktif */
          .sidebar .nav-link.active {
            color: white;
            font-weight: 700;
            /* Gradient aesthetic yang cerah */
            background: linear-gradient(90deg, #f5576c 0%, #f093fb 100%);
            box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4); /* Shadow untuk yang aktif */
            border: none;
          }
          
          /* Pastikan ikon memiliki jarak yang tepat */
          .sidebar .nav-link i {
            margin-right: 10px;
            font-size: 1.1rem;
          }
        `}
      </style>

      {/* Sidebar Component */}
      <div className="sidebar d-flex flex-column flex-shrink-0 p-3">
        <ul className="nav nav-pills flex-column mb-auto mt-3">
          <li className="nav-item">
            <NavLink
              to="/"
              // Class aktif menggunakan conditional rendering biasa agar sesuai dengan style CSS baru
              className={
                location.pathname === "/" ? "nav-link active" : "nav-link"
              }
            >
              <i className="bi bi-house"></i>
              Beranda
            </NavLink>
          </li>
          {/* Anda bisa tambahkan link lain di sini jika diperlukan */}
          {/* <li className="nav-item">
            <NavLink
              to="/profile"
              className={
                location.pathname === "/profile" ? "nav-link active" : "nav-link"
              }
            >
              <i className="bi bi-person-circle"></i>
              Profil
            </NavLink>
          </li> */}
        </ul>
      </div>
    </>
  );
}

export default SidebarComponent;
