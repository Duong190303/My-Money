import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("header", "welcome/Header.tsx"),
  route("login", "welcome/Header/Avatar/Login.tsx"),
  // route("register", "welcome/Register.tsx"),
  route("income", "welcome/Transaction/Income/Income.tsx"),
  route("expenses", "welcome/Transaction/Expenses/Expenses.tsx"),
  route("datareport", "welcome/DataReport/DataReport.tsx"),
  route("profile", "welcome/Profile/Profile.tsx"),
  // route("/", "welcome/Home.tsx"),
] satisfies RouteConfig;
