import { Link } from "react-router";

export default function Income() {
  return (
    <div className="income-background">
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
          <div className="home-login-button" >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/79bd5203f63e2a5e79bf3c947570b8ed31965494"
              className="home-profile-icon"
              alt=""
            />
            <Link className="home-login-text" to="/login">
              Log out
            </Link>
          </div>
        </div>
      </div>
      <div className="income-container">
        
      </div>
    </div>
  );
}
