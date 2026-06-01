import Header from "./components/Header";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Cities from "./components/Cities";
import Properties from "./components/Properties";
import About from "./components/About";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Marquee />
      <Cities />
      <Properties />
      <About />
    </>
  );
}