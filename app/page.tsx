import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Cities from "./components/Cities";
import Properties from "./components/Properties";
import About from "./components/About";
import MapSection from "./components/MapSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Marquee />
      <Cities />
      <Properties />
      <About />
      <MapSection />
      <Contact /> 
      <Footer /> 
      <ChatWidget />
    </>
  );
}