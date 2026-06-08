// Homepage. SearchProvider wraps the whole tree so Hero and Properties can
// share filter state via context, even though other sections (Marquee, Cities)
// sit between them in the rendered order.

import Header from "./components/Header";
import { SearchProvider } from "./components/SearchContext";
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
      {/* Provider wraps Hero + Properties so they can share search state.
          Other sections in between render normally; they just ignore the context. */}
      <SearchProvider>
        <Hero />
        <Marquee />
        <Cities />
        <Properties />
      </SearchProvider>
      <About />
      <MapSection />
      <Contact />
      <Footer />
      <ChatWidget />
    </>
  );
}