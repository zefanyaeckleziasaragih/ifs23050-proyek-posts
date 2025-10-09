// ============= LOGIN PAGE =============
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthLogin,
  setIsAuthLoginActionCreator,
} from "../states/action";
import { useEffect, useState } from "react";
import apiHelper from "../../../helpers/apiHelper";
import { asyncSetProfile, setIsProfile } from "../../users/states/action";

function LoginPage() {
  const dispatch = useDispatch();

  const isAuthLogin = useSelector((state) => state.isAuthLogin);
  const isProfile = useSelector((state) => state.isProfile);

  const [loading, setLoading] = useState(false);
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // 1. Periksa apakah login berhasil
  useEffect(() => {
    if (isAuthLogin === true) {
      const authToken = apiHelper.getAccessToken();
      if (authToken) {
        dispatch(asyncSetProfile());
      } else {
        setLoading(false);
        dispatch(setIsAuthLoginActionCreator(false));
      }
    }
  }, [isAuthLogin]);

  // 2. Jika gagal login set loading dan status isAuthLogin ke false
  useEffect(() => {
    if (isProfile) {
      setLoading(false);
      dispatch(setIsAuthLoginActionCreator(false));
      dispatch(setIsProfile(false));
    }
  }, [isProfile]);

  // Fungsi untuk menangani pengiriman form. Akan memicu efek pada step-1
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthLogin(email, password));
  }

  return (
    <>
      <style>
        {`
          @keyframes floatAnimation {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .auth-input-focus:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .auth-btn-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: all 0.3s ease;
          }
          .auth-btn-gradient:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          }
          .auth-btn-gradient:active:not(:disabled) {
            transform: translateY(0);
          }
        `}
      </style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Circles */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            top: "-100px",
            left: "-100px",
            animation: "floatAnimation 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            bottom: "-80px",
            right: "-80px",
            animation: "floatAnimation 8s ease-in-out infinite reverse",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo/Header Card */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 20px",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, #f58529 0%, #dd2a7b 40%, #8134af 70%, #515bd4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                animation: "floatAnimation 3s ease-in-out infinite",
              }}
            >
              <i
                className="bi bi-chat-heart-fill"
                style={{ fontSize: "40px", color: "white" }}
              ></i>
            </div>
            <h1
              style={{
                color: "white",
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "8px",
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              Selamat Datang
            </h1>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "1rem",
                margin: 0,
              }}
            >
              Masuk untuk melanjutkan
            </p>
          </div>

          {/* Main Form Card */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              animation: "fadeInUp 0.6s ease-out 0.2s backwards",
            }}
          >
            <form onSubmit={onSubmitHandler} method="POST">
              <div className="mb-4">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                    marginBottom: "10px",
                  }}
                >
                  <i
                    className="bi bi-envelope-fill"
                    style={{ marginRight: "8px", color: "#667eea" }}
                  ></i>
                  Alamat Email
                </label>
                <input
                  type="email"
                  onChange={onEmailChange}
                  className="form-control auth-input-focus"
                  required
                  style={{
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    backgroundColor: "#f8f9fa",
                  }}
                  placeholder="nama@email.com"
                />
              </div>

              <div className="mb-4">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95rem",
                    marginBottom: "10px",
                  }}
                >
                  <i
                    className="bi bi-lock-fill"
                    style={{ marginRight: "8px", color: "#667eea" }}
                  ></i>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  onChange={onPasswordChange}
                  className="form-control auth-input-focus"
                  required
                  style={{
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    backgroundColor: "#f8f9fa",
                  }}
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-3 pt-2">
                {loading ? (
                  <button
                    className="btn auth-btn-gradient w-100"
                    disabled
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "1.05rem",
                      fontWeight: "600",
                      color: "white",
                      opacity: 0.7,
                    }}
                  >
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "10px" }}
                    ></span>
                    Memuat...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn auth-btn-gradient w-100"
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      border: "none",
                      fontSize: "1.05rem",
                      fontWeight: "600",
                      color: "white",
                    }}
                  >
                    <i
                      className="bi bi-box-arrow-in-right"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Masuk
                  </button>
                )}
              </div>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
                paddingTop: "24px",
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>
                Belum punya akun?{" "}
                <a
                  href="/auth/register"
                  style={{
                    color: "#667eea",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Daftar sekarang
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              animation: "fadeInUp 0.6s ease-out 0.4s backwards",
            }}
          >
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "0.85rem",
                margin: 0,
              }}
            >
              © 2025 Zefanya Ecklezia Saragih - 11S23050.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
