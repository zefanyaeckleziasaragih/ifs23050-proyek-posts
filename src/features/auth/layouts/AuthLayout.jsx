// AuthLayout.jsx
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";
import { useEffect } from "react";

function AuthLayout() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profile = useSelector((state) => state.profile);
  const isProfile = useSelector((state) => state.isProfile);

  // 1. Jalankan sekali untuk mengecek apakah pengguna sudah login
  useEffect(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      dispatch(asyncSetProfile());
    }
  }, [dispatch]);

  // 2. Jika pengguna sudah login, arahkan ke halaman utama
  useEffect(() => {
    if (isProfile) {
      dispatch(setIsProfile(false));
      if (profile) {
        navigate("/");
      }
    }
  }, [isProfile, profile, dispatch, navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        position: "relative",
        // Hapus padding: "20px"
        // Pertahankan background gradient sebagai background utama
        background:
          "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd140 100%)",
        display: "flex",
        alignItems: "stretch", // Pastikan Outlet meregang secara vertikal
        justifyContent: "stretch", // Pastikan Outlet meregang secara horizontal
        boxSizing: "border-box",
      }}
    >
      {/* Background circles telah dihapus di sini */}

      {/* Konten Outlet (Login/Register) - Sekarang 100% fit ke viewport */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1, // Mengambil seluruh ruang yang tersedia
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
