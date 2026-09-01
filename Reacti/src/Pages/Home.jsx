import Footer from "../Components/Footer";
import Hero from "../Components/Hero"
import Navbar from "../Components/Navbar"
import Trend from "../Components/Trend";
import "./Home.css";

function Home() {
  return (
    <>
      <div className="home">
        <Navbar />
        <Hero /> 
      </div>
       <Trend />
       <Footer/>
      

     
    </>
  );
}

export default Home