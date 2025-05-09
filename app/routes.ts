import { type RouteConfig, index, route } from "@react-router/dev/routes";


export default [
    index("routes/home.tsx"),
    route("header", "welcome/Header.tsx"),
    route("login", "welcome/Login.tsx"),
    route("register", "welcome/Register.tsx"),
    route("income", "welcome/Income.tsx"),
    route("expenses", "welcome/Expenses.tsx"),
    route("datareport", "welcome/Datareport.tsx"),
    route("profile", "welcome/Profile.tsx"),
    // route("/", "welcome/Home.tsx"), 
] satisfies RouteConfig;