import React from "react";
import Hero from "../components/Hero";
import TopNiches from "../components/TopNiches";
import HowItWorks from "../components/HowItWorks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  return (
    <>
      {/* <ToastContainer /> */}
      <Hero />
      <TopNiches />
      <HowItWorks />
    </>
  );
};

export default Home;
