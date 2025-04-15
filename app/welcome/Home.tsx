import { Header } from "./Header";

interface HomeProps {
}
const Home: React.FC<HomeProps> = () => {
  if (typeof window === "undefined") return null;
  return (
    <div className="home-background">
      <Header/>
    </div>
  );
};

export default Home;