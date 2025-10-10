// SidebarComponent.jsx
import { NavLink, useLocation } from "react-router-dom";
import React from "react";

function SidebarComponent() {
  const location = useLocation(); // Gunakan useLocation untuk mendapatkan path aktif

  // Definisikan konstanta warna/gradien dari inspirasi HomePage/Sidebar Active
  const ACTIVE_GRADIENT = "linear-gradient(90deg, #f5576c 0%, #f093fb 100%)"; // Gradien dari Sidebar Active Awal
  const HOVER_ACCENT = "#dd2a7b"; // Warna aksen dari HomePage/Sidebar Hover Awal
  const PRIMARY_COLOR = "#667eea"; // Warna Primer dari HomePage

  return (
    <>
      {/* Tambahkan Style CSS untuk Sidebar */}
      <style>
        {`
          /* === Sidebar Container Aesthetic Baru === */
          .sidebar {
            width: 280px; /* Lebar sedikit lebih besar */
            background: #ffffff;
            border-right: none; /* Hilangkan border, gunakan shadow */
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1); /* Shadow lebih tegas */
            transition: all 0.3s ease;
            min-height: 100vh; /* Pastikan tinggi penuh */
            padding-right: 20px !important; /* Tambah padding agar konten tidak terlalu rapat */
            padding-left: 20px !important;
          }
          
          /* === Style untuk NavLink default yang dipercantik === */
          .sidebar .nav-link {
            padding: 15px 20px; /* Padding lebih besar */
            margin-bottom: 12px;
            border-radius: 18px; /* Lebih rounded, konsisten dengan HomePage card */
            color: #555;
            font-weight: 600; /* Font lebih tebal */
            font-size: 1.05rem;
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0; /* Tambahkan border halus */
          }
          
          /* Hover effect yang lebih interaktif */
          .sidebar .nav-link:hover {
            background-color: #ffe6f5; /* Background sangat lembut */
            color: ${HOVER_ACCENT}; 
            transform: translateY(-3px) scale(1.01); /* Efek float seperti di HomePage */
            box-shadow: 0 5px 15px rgba(221, 42, 123, 0.15); /* Shadow lembut saat hover */
            border-color: ${HOVER_ACCENT};
          }

          /* Style untuk NavLink yang aktif (menggunakan gradien & shadow tegas) */
          .sidebar .nav-link.active {
            color: white;
            font-weight: 700;
            background: ${ACTIVE_GRADIENT}; /* Gradien aesthetic yang cerah */
            box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4); /* Shadow untuk yang aktif, lebih tegas */
            border: none;
            transform: translateY(-2px); /* Sedikit terangkat saat aktif */
          }
          
          /* Pastikan ikon memiliki jarak yang tepat */
          .sidebar .nav-link i {
            margin-right: 10px;
            font-size: 1.2rem; /* Ikon sedikit lebih besar */
          }

          /* Style untuk list agar lebih rapi */
          .sidebar .nav-pills {
            padding-top: 10px;
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
