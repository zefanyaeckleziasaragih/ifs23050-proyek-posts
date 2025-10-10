// src/pages/SettingsPage.jsx

import React, { useEffect, useState } from "react";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper";
import "../../posts/resources/custom.css";

function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Definisikan kembali konstanta CSS dari ProfilePage
  const PRIMARY_COLOR = "#667eea"; // (Biru)
  const ACCENT_COLOR = "#f58529"; // (Oranye)

  useEffect(() => {
    setFadeIn(true);
    setLoading(false);
  }, []);

  const handleSaveSettings = () => {
    try {
      showSuccessDialog("Semua pengaturan berhasil disimpan!");
    } catch (error) {
      showErrorDialog("Gagal menyimpan pengaturan. Silakan coba lagi.");
    }
  };

  const handleSendReport = () => {
    showSuccessDialog(
      "Laporan Anda berhasil dikirim. Kami akan segera memeriksanya!"
    );
  };

  const handleContactSupport = () => {
    const emailAddress = "zefanyaecklesia.s@gmail.com";
    const subject = "Dukungan Aplikasi Saya";
    const body = "Halo, saya ingin meminta bantuan mengenai...";
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  // --- Style Disederhanakan (Hanya Light Mode) ---
  const lightModeStyles = {
    mainBg: "#f8f9fa",
    textColor: "#212529",
    cardBg: "#fff",
    cardBorder: "#eee",
    separatorBorder: "rgba(0,0,0,0.1)",
  };

  if (loading)
    return <div className="text-center mt-5">Memuat pengaturan...</div>;

  return (
    <>
      {/* Pertahankan style untuk komponen internal saja */}
      <style>
        {`
          /* Animasi */
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          /* Custom style untuk konsistensi input focus dari ProfilePage */
          .home-input-focus:focus {
            border-color: ${PRIMARY_COLOR} !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .home-input-style {
            border-radius: 12px !important;
            padding: 12px 18px !important; 
            box-shadow: inset 0 1px 4px rgba(0,0,0,0.1);
            border: 2px solid #e0e0e0 !important;
            font-weight: 500;
          }
          /* Gaya Tombol Dukungan/Aksi */
          .btn-support-styled {
            background-color: #0d6efd !important;
            color: white;
            font-weight: 700;
            border-radius: 12px !important;
            padding: 0.75rem 0 !important;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 8px 15px rgba(13, 110, 253, 0.3);
          }
          .btn-support-styled:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(13, 110, 253, 0.5);
          }
          .btn-secondary-styled {
            background-color: #6c757d !important;
            color: white;
            font-weight: 700;
            border-radius: 12px !important;
            padding: 0.75rem 0 !important;
            border: none;
            transition: all 0.3s ease;
          }
          .btn-secondary-styled:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(108, 117, 125, 0.4);
          }
          /* Offset Sidebar HAPUS - Ditangani oleh UserLayout */
          /* .ps-sidebar-offset { ... } */
        `}
      </style>

      {/* HAPUS WRAPPER UTAMA DENGAN BACKGROUND DAN MINHEIGHT */}
      <div
        className="main-content"
        style={{ position: "relative", zIndex: 10, paddingBottom: "50px" }}
      >
        <div
          className="container-fluid pt-5 pb-5"
          style={{ maxWidth: 800, margin: "0 auto", padding: "0 15px" }}
        >
          {/* Judul Halaman */}
          <h2
            className={`fw-bold mb-5 text-center text-dark`}
            style={{
              fontSize: "2.5rem",
              animation: "fadeInUp 0.6s ease-out",
              color: lightModeStyles.textColor,
            }}
          >
            <i
              className="bi bi-gear-fill"
              style={{ marginRight: 10, color: PRIMARY_COLOR }}
            ></i>
            Pengaturan Aplikasi
          </h2>

          {/* Kontainer Card Utama */}
          <div
            className={`p-4 p-md-5`}
            style={{
              background: lightModeStyles.cardBg,
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              animation: "fadeInUp 0.6s ease-out 0.2s backwards",
              border: "1px solid #eee",
            }}
          >
            {/* --- PENGATURAN AKUN DASAR --- */}
            <div
              className="mb-5 pb-4 border-bottom"
              style={{ borderColor: lightModeStyles.separatorBorder }}
            >
              <h5
                className={`mb-4 fw-bold text-dark`}
                style={{ color: PRIMARY_COLOR }}
              >
                <i
                  className="bi bi-info-circle-fill me-2"
                  style={{ color: PRIMARY_COLOR }}
                ></i>
                Pengaturan Akun Dasar
              </h5>

              <div className="mb-3">
                <label className={`form-label fw-semibold text-dark`}>
                  Zona Waktu
                </label>
                <select
                  className="form-select home-input-focus home-input-style"
                  defaultValue="wib"
                  style={{ padding: "12px 18px", height: "auto" }}
                >
                  <option value="wib">WIB (GMT+7) - Jakarta</option>
                  <option value="wit">WIT (GMT+9) - Jayapura</option>
                  <option value="wita">WITA (GMT+8) - Bali</option>
                </select>
              </div>

              <div className="form-check form-switch mb-4 pt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="emailUpdateSwitch"
                  defaultChecked
                  style={{ width: "2.5rem", height: "1.4rem" }}
                />
                <label
                  className={`form-check-label ms-2 text-dark`}
                  htmlFor="emailUpdateSwitch"
                >
                  Terima Notifikasi Update via Email
                </label>
              </div>

              {/* Tombol Simpan Pengaturan Umum */}
              <button
                className="btn w-100 mt-2"
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  color: "white",
                  fontWeight: 700,
                  borderRadius: 12,
                  padding: "0.75rem 0",
                  transition: "all 0.3s ease",
                }}
                onClick={handleSaveSettings}
              >
                Simpan Pengaturan
              </button>
            </div>

            {/* --- DUKUNGAN & BANTUAN --- */}
            <div>
              <h5
                className={`mb-4 fw-bold text-dark`}
                style={{ color: ACCENT_COLOR }}
              >
                <i
                  className="bi bi-headset me-2"
                  style={{ color: ACCENT_COLOR }}
                ></i>
                Dukungan & Bantuan
              </h5>

              <p className="text-secondary">
                Jika Anda memiliki pertanyaan, saran, atau menemukan masalah,
                silakan hubungi tim dukungan kami.
              </p>

              <div className="d-grid gap-3">
                {/* Tombol Buka Email */}
                <button
                  className="btn w-100 btn-support-styled"
                  onClick={handleContactSupport}
                >
                  <i className="bi bi-envelope-fill me-2"></i>
                  Email Dukungan ({"zefanyaecklesia.s@gmail.com"})
                </button>

                {/* Tombol Kirim Laporan (Simulasi dengan Dialog) */}
                <button
                  className="btn w-100 btn-secondary-styled"
                  onClick={handleSendReport}
                >
                  <i className="bi bi-bug-fill me-2"></i>
                  Kirim Laporan Bug
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
