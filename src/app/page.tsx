import Navbar from "./Nav/navigationbar";
import AboutUsMain from "./components/aboutusmain";
import LebanonMap from "./components/cesiummap/d3map";
import SlicerSwiper from "./components/swiiper/SlicerSwiper";
export default function Home() {
  return (
    <div className="bg-red">
      <Navbar />
      <div className="bg-red-600">
      <SlicerSwiper />
      <p>hiiii</p>
      </div>
      <AboutUsMain/>
      <LebanonMap />
    </div>
  );
}