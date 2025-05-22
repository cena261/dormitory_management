import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");

  const { login, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.querySelector(".container");
    const qtvBtn = document.querySelector(".administrator-btn");
    const stdBtn = document.querySelector(".student-btn");

    const handleQtvClick = () => {
      container.classList.add("active");
      setIsAdmin(true);
    };

    const handleStdClick = () => {
      container.classList.remove("active");
      setIsAdmin(false);
    };

    qtvBtn.addEventListener("click", handleQtvClick);
    stdBtn.addEventListener("click", handleStdClick);

    return () => {
      qtvBtn.removeEventListener("click", handleQtvClick);
      stdBtn.removeEventListener("click", handleStdClick);
    };
  }, []);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(studentUsername, studentPassword, false);
      if (userData.role === "SinhVien") {
        navigate("/personal-info");
      } else {
        setError("Sai thông tin tài khoản hoặc mật khẩu");
        logout();
      }
    } catch (err) {
      setError("Sai thông tin tài khoản hoặc mật khẩu");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(adminUsername, adminPassword, true);
      if (userData.role === "QuanTriVien") {
        navigate("/dashboard");
      } else {
        setError("Sai thông tin tài khoản hoặc mật khẩu");
        logout();
      }
    } catch (err) {
      setError("Sai thông tin tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div className="login-page">
      <div className="background bg-[url('/img/schoolpic.jpg')] bg-cover bg-center bg-no-repeat relative flex justify-center items-center min-h-screen">
        <div className="overlay absolute inset-0 bg-black/50 z-0 flex justify-center items-center"></div>
        <div className="container relative w-[850px] h-[550px] bg-white rounded-4xl shadow-lg z-10 m-[20px] overflow-hidden">
          <div className="form-box login">
            <form onSubmit={handleStudentLogin} className="w-full">
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Mã số sinh viên"
                  required
                  value={studentUsername}
                  onChange={(e) => setStudentUsername(e.target.value)}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  required
                  value={studentPassword}
                  onChange={(e) => {
                    setStudentPassword(e.target.value);
                    setError("");
                  }}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              {error && !isAdmin && (
                <div className="text-red-500 text-xs error-login">{error}</div>
              )}
              <div className="forgot-link mt-2">
                <a href="#">Quên mật khẩu ?</a>
              </div>
              <button type="submit" className="btn">
                Login
              </button>
              <p>Nếu bạn chưa có tài khoản, hãy liên hệ trang hỗ trợ</p>
              <div className="social-icons">
                <a href="#">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-gmail"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#">
                  <img
                    className="w-[24px] h-[24px] object-contain rounded-[10px]"
                    src="/img/zola.jpg"
                    alt="Zalo"
                  />
                </a>
              </div>
            </form>
          </div>

          <div className="form-box administrator">
            <form onSubmit={handleAdminLogin}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Tài khoản quản trị"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                />
                <i className="bx bxs-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  required
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setError("");
                  }}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              {error && isAdmin && (
                <div className="text-red-500 text-xs error-login">{error}</div>
              )}
              <div className="forgot-link mt-2">
                <a href="#">Quên mật khẩu ?</a>
              </div>
              <button type="submit" className="btn">
                Login
              </button>
              <p>Nếu bạn chưa có tài khoản, hãy liên hệ trang hỗ trợ</p>
              <div className="social-icons">
                <a href="#">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-gmail"></i>
                </a>
                <a href="#">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#">
                  <img
                    className="w-[24px] h-[24px] object-contain rounded-[10px]"
                    src="/img/zola.jpg"
                    alt="Zalo"
                  />
                </a>
              </div>
            </form>
          </div>

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Sinh viên đăng nhập</h1>
              <p>Bạn là quản trị viên ?</p>
              <button className="btn administrator-btn">QTV Đăng Nhập</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>QTV đăng nhập</h1>
              <p>Bạn là sinh viên ?</p>
              <button className="btn student-btn">Sinh viên Đăng Nhập</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
