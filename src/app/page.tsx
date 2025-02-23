import Navbar from "./Nav/navigationbar";
import AboutUsMain from "./components/aboutusmain";
import LebanonMap from "./components/cesiummap/d3map";
import ContactUsMain from "./components/contactusmain";
import MainFooter from "./components/footer";
import HomeParalax from "./components/homeparalax";
import ParallaxStats from "./components/stats";
import SlicerSwiper from "./components/swiiper/SlicerSwiper";
export default function Home() {
  return (
    <div className="bg-red">
      <Navbar />

      <SlicerSwiper />
      
      <AboutUsMain/>
      <HomeParalax/>
      <ContactUsMain/>
      <ParallaxStats/>
      <MainFooter/>
      <footer />
    </div>
  );
}