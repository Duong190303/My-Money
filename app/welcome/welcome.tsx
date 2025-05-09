import { Header } from "./Header";

export function Home() {
  if (typeof window === "undefined") return null;
  return (
    
  <div className="home-background">
    <Header/>
  </div>
  );
};
