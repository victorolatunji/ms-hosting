// Homepage. SearchProvider wraps Hero + Properties so they share filter state.
// The listing list comes from getPublicProperties(), so admin status changes
// (unavailable / hidden) show up here. Refreshed at most every 60 seconds,
// and immediately when the admin saves a change.

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
import { getPublicProperties } from "@/lib/listing-status";

export const revalidate = 60;

export default async function Home() {
  const properties = await getPublicProperties();
  return (
    <>
      <Header />
      <SearchProvider>
        <Hero properties={properties} />
        <Marquee properties={properties} />
        <Cities properties={properties} />
        <Properties properties={properties} />
      </SearchProvider>
      <About />
      <MapSection properties={properties} />
      <Contact />
      <Footer />
    </>
  );
}
