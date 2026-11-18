// /saved: the guest's shortlist. Lets them send the whole list to Sam and Maddie.
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SavedList from "@/app/components/SavedList";

export const metadata: Metadata = {
  title: "Your saved stays | M&S Hosting",
  robots: { index: false },
};

export default function SavedPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1320px] px-5 pb-[110px] pt-8 md:px-6 md:pt-12">
        <SavedList />
      </main>
      <Footer />
    </>
  );
}
