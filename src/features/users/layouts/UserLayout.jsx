// src/features/users/layouts/UserLayout.jsx

import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Pastikan useLocation diimpor
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";
// --------------------------------------------------------------------------------------
import NavbarComponent from "../../posts/components/NavbarComponent";
import SidebarComponent from "../../posts/components/SidebarComponent";
// --------------------------------------------------------------------------------------

function UserLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // <--- BARIS INI DITAMBAHKAN

  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  // --- LOGIC AUTENTIKASI (TETAP SAMA) ---
  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    } else {
      navigate("/auth/login");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));
      if (!profile) {
        apiHelper.putAccessToken("");
        navigate("/auth/login");
      }
    }
  }, [isProfile, profile, dispatch, navigate]);
  // --- END LOGIC AUTENTIKASI ---

  // ########### PERBAIKAN SCROLL DI SINI ###########
  useEffect(() => {
    // Memaksa window (browser) untuk scroll ke posisi paling atas (0,0)
    window.scrollTo(0, 0);

    // Bergantung pada perubahan path/pathname
    // Ini memastikan scroll ke atas terjadi setiap kali berpindah halaman
  }, [location.pathname]); // Gunakan location.pathname agar berjalan setiap kali URL berubah
  // ###############################################

  function handleLogout() {
    apiHelper.putAccessToken("");
    navigate("/auth/login");
  }

  if (!profile) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-2">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <NavbarComponent profile={profile} handleLogout={handleLogout} />

      <SidebarComponent />

      <div className="ps-sidebar-offset">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
