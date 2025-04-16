import { Text } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  if (typeof window === "undefined") return null;
  const navigate = useNavigate();


  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token hoặc user session
    localStorage.removeItem("user");
    navigate("/login"); // Chuyển về trang Login
  };
  return (
    
  <div className="header-background"
  style={{
    display: "flex",
    width: "105%",
    justifyContent: "space-evenly"
  }}
  >
    {/* Header nằm trong background */}
    <div className="home-header-container">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/18083109a25a67b4d19a5291268bdd2c91ef258e"
        className="home-logo"
        alt="My Money"
      />
      <nav className="home-navigation">
        <Link className="home-nav-item" to="/">
          HOME
        </Link>
        <Link className="home-nav-item" to="/income">
          INCOME
        </Link>
        <Link className="home-nav-item" to="/expenses">
          EXPENSES
        </Link>
        <Link className="home-nav-item" to="/report">
          DATA REPORT
        </Link>
      </nav>
      <div className="home-login-container">
        <div className="home-login-button" onClick={handleLogout}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
            className="home-profile-icon"
            alt=""
          />
          <span className="home-login-text">
            Log out
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};
