import { NavLink, useLocation } from "react-router-dom";
import React from "react";

function SidebarComponent() {
  const location = useLocation();

  const ACTIVE_GRADIENT = "linear-gradient(90deg, #f5576c 0%, #f093fb 100%)";
  const HOVER_ACCENT = "#dd2a7b";
  const PRIMARY_COLOR = "#667eea";

  return (
    <>
      <style>
        {`
          .sidebar {
            width: 280px;
            background: #ffffff;
            border-right: none;
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            min-height: 100vh;
            padding-right: 20px !important;
            padding-left: 20px !important;
          }
          
          .sidebar .nav-link {
            padding: 15px 20px;
            margin-bottom: 12px;
            border-radius: 18px;
            color: #555;
            font-weight: 600;
            font-size: 1.05rem;
            transition: all 0.3s ease;
            border: 1px solid #f0f0f0;
          }
          
          .sidebar .nav-link:hover {
            background-color: #ffe6f5;
            color: ${HOVER_ACCENT}; 
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 5px 15px rgba(221, 42, 123, 0.15);
            border-color: ${HOVER_ACCENT};
          }

          .sidebar .nav-link.active {
            color: white;
            font-weight: 700;
            background: ${ACTIVE_GRADIENT};
            box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);
            border: none;
            transform: translateY(-2px);
          }
          
          .sidebar .nav-link i {
            margin-right: 10px;
            font-size: 1.2rem;
          }

          .sidebar .nav-pills {
            padding-top: 10px;
          }
        `}
      </style>

      <div className="sidebar d-flex flex-column flex-shrink-0 p-3">
        <ul className="nav nav-pills flex-column mb-auto mt-3">
          <li className="nav-item">
            <NavLink
              to="/"
              className={
                location.pathname === "/" ? "nav-link active" : "nav-link"
              }
            >
              <i className="bi bi-house"></i>
              Beranda
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SidebarComponent;

/*
 * Dokumentasi Kode
 *
 * SidebarComponent adalah komponen fungsional React yang berfungsi sebagai bilah sisi (sidebar) untuk navigasi aplikasi.
 * Komponen ini menggunakan Hook `useLocation` dari `react-router-dom` untuk menentukan jalur URL saat ini dan menerapkan gaya aktif ke NavLink yang sesuai.
 *
 * Dependencies:
 * - NavLink, useLocation dari "react-router-dom"
 * - React
 *
 * Konstanta Styling:
 * - ACTIVE_GRADIENT: String yang mendefinisikan gradien latar belakang untuk tautan navigasi yang aktif.
 * - HOVER_ACCENT: Warna aksen yang digunakan untuk efek hover pada tautan.
 * - PRIMARY_COLOR: Warna primer yang didefinisikan tetapi tidak digunakan secara eksplisit di gaya CSS akhir.
 *
 * Logic:
 * - useLocation(): Mengambil objek lokasi, yang properti `pathname`nya digunakan untuk memeriksa jalur saat ini.
 * - NavLink Rendering: Komponen `NavLink` digunakan untuk tautan internal. Properti `className` dihitung secara kondisional:
 * - Jika `location.pathname` sama dengan path target (misalnya, `/`), kelas `"nav-link active"` diterapkan.
 * - Jika tidak, hanya kelas `"nav-link"` yang diterapkan.
 * - Pendekatan ini memungkinkan kustomisasi gaya yang detail melalui CSS kustom, bukan hanya mengandalkan properti bawaan `NavLink` `activeClassName`.
 *
 * Styling (CSS Inline):
 * - CSS disuntikkan menggunakan tag `<style>` dan template literal.
 * - .sidebar: Mengatur lebar, latar belakang putih, menghilangkan border, dan menambahkan `box-shadow` yang tegas untuk tampilan yang lebih modern. Juga memastikan tinggi penuh (`min-height: 100vh`).
 * - .sidebar .nav-link: Mengatur padding, `border-radius` yang besar (18px), warna teks abu-abu gelap, dan font yang tebal.
 * - .sidebar .nav-link:hover: Menambahkan efek interaktif dengan latar belakang lembut, warna teks aksen, dan efek *float* (`transform: translateY(-3px) scale(1.01)`) yang memberikan kesan dinamis.
 * - .sidebar .nav-link.active: Menerapkan `ACTIVE_GRADIENT` sebagai latar belakang, warna teks putih, `font-weight` yang lebih tebal, dan `box-shadow` yang tegas untuk menonjolkan tautan yang sedang aktif.
 * - .sidebar .nav-link i: Memastikan ikon memiliki ukuran dan jarak yang tepat dari teks tautan.
 *
 * Struktur Tampilan:
 * - Sidebar direpresentasikan oleh `<div>` dengan kelas Bootstrap `sidebar d-flex flex-column flex-shrink-0 p-3`.
 * - Navigasi adalah daftar tak berurutan (`<ul>`) dengan kelas `nav nav-pills flex-column mb-auto mt-3`.
 * - Saat ini, hanya ada satu tautan navigasi yang didefinisikan: **"Beranda"** (`/`) dengan ikon rumah (`bi-house`).
 */
