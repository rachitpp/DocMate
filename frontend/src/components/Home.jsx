import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import NewsLetter from "./NewsLetter";

function Home() {
  return (
    <div className="home-section">
      <Navbar />
      <Hero />
      <Reviews />
      <NewsLetter />
      <Footer />
    </div>
  );
}

export default Home;
