// ============= REGISTER PAGE =============
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import {
  asyncSetIsAuthRegister,
  setIsAuthRegisterActionCreator,
} from "../states/action";
import { useEffect, useState } from "react";

function RegisterPage() {
  const dispatch = useDispatch();

  const isAuthRegister = useSelector((state) => state.isAuthRegister);

  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const [name, onChangeName] = useInput("");
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // 1. Periksa apakah register telah selesai diproses
  useEffect(() => {
    if (isAuthRegister === true) {
      setLoading(false);
      dispatch(setIsAuthRegisterActionCreator(false));
    }
  }, [isAuthRegister]);

  // Fungsi untuk menangani pengiriman form. Akan memicu efek pada step-1
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(asyncSetIsAuthRegister(name, email, password));
  }

  return (
    <>
      <style>
        {`
          @keyframes floatAnimationReg {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(5deg); }
          }
          @keyframes fadeInUpReg {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .reg-input-focus:focus {
            border-color: #f093fb !important;
            box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.15) !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .reg-btn-gradient {
            background: linear-gradient(135deg, #f58529 0%, #dd2a7b 40%, #8134af 70%, #515bd4 100%);
            transition: all 0.3s ease;
          }
          .reg-btn-gradient:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(221, 42, 123, 0.4);
          }
          .reg-btn-gradient:active:not(:disabled) {
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
            "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd140 100%)",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.12)",
            top: "-80px",
            right: "-80px",
            animation: "floatAnimationReg 7s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
            bottom: "-60px",
            left: "-60px",
            animation: "floatAnimationReg 9s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            top: "50%",
            left: "10%",
            animation: "floatAnimationReg 5s ease-in-out infinite",
          }}
        />

        <div
          style={{
            width: "100%",
            maxWidth: "480px",
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
              animation: "fadeInUpReg 0.6s ease-out",
            }}
          >
            <div
              style={{
                width: "85px",
                height: "85px",
                margin: "0 auto 20px",
                borderRadius: "22px",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)",
                animation: "floatAnimationReg 3.5s ease-in-out infinite",
              }}
            >
              <i
                className="bi bi-person-plus-fill"
                style={{ fontSize: "42px", color: "white" }}
              ></i>
            </div>
            <h1
              style={{
                color: "white",
                fontSize: "2.1rem",
                fontWeight: "700",
                marginBottom: "8px",
                textShadow: "0 2px 15px rgba(0,0,0,0.2)",
              }}
            >
              Buat Akun Baru
            </h1>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.95)",
                fontSize: "1rem",
                margin: 0,
              }}
            >
              Bergabunglah dengan kami sekarang
            </p>
          </div>

          {/* Main Form Card */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(20px)",
              borderRadius: "26px",
              padding: "42px",
              boxShadow: "0 22px 65px rgba(0, 0, 0, 0.3)",
              animation: "fadeInUpReg 0.6s ease-out 0.2s backwards",
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
                    className="bi bi-person-fill"
                    style={{ marginRight: "8px", color: "#f093fb" }}
                  ></i>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  onChange={onChangeName}
                  className="form-control reg-input-focus"
                  required
                  style={{
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    backgroundColor: "#f8f9fa",
                  }}
                  placeholder="Masukkan nama lengkap"
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
                    className="bi bi-envelope-fill"
                    style={{ marginRight: "8px", color: "#f093fb" }}
                  ></i>
                  Alamat Email
                </label>
                <input
                  type="email"
                  onChange={onChangeEmail}
                  className="form-control reg-input-focus"
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
                    style={{ marginRight: "8px", color: "#f093fb" }}
                  ></i>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  onChange={onChangePassword}
                  className="form-control reg-input-focus"
                  required
                  style={{
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "2px solid #e0e0e0",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    backgroundColor: "#f8f9fa",
                  }}
                  placeholder="Minimal 8 karakter"
                />
              </div>

              <div className="mb-3 pt-2">
                {loading ? (
                  <button
                    className="btn reg-btn-gradient w-100"
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
                    className="btn reg-btn-gradient w-100"
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
                      className="bi bi-check-circle-fill"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Daftar
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
                Sudah punya akun?{" "}
                <a
                  href="/auth/login"
                  style={{
                    color: "#f093fb",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Masuk sekarang
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div
            style={{
              textAlign: "center",
              marginTop: "24px",
              animation: "fadeInUpReg 0.6s ease-out 0.4s backwards",
            }}
          >
            <p
              style={{
                color: "rgba(255, 255, 255, 0.9)",
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

export default RegisterPage;
