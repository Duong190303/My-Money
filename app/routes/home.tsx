import type { Route } from "./+types/home";
import { Home as Welcome } from "../welcome/welcome"; // Rename the imported component to Welcome
import { Link } from "react-router-dom";

// ... rest of the code

export default function Home() {
  return (
    <>
      <Welcome />
    </>

  );
}
