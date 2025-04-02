import React from "react";
import Doctor from "../Assets/doctor-group.png";
import SolutionStep from "./SolutionStep";
import "../Styles/About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Doctor} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description font-bold">
        Welcome to Docmate, where we are committed to revolutionizing the healthcare industry through innovation and technology. Our mission is to create a user-friendly web application that transforms the traditional appointment scheduling process for both doctors and patients. At Docmate, we believe in streamlining and enhancing the efficiency of appointment management to make healthcare more accessible and convenient for everyone.
        </p>

        <h4 className="about-text-title font-bold text-green-900">Your Solutions</h4>

        <SolutionStep
          title="Choose a Specialist"
          description="Find your perfect specialist and book with ease at Docmate. Expert doctors prioritize your health, offering tailored care."
        />

        <SolutionStep
          title="Make a Schedule"
          description="Choose the date and time that suits you best, and let the dedicated team of medical reputed hospitals ensure your well-being with personalized care."
        />

        <SolutionStep
          title="Get Your Solutions"
          description="Experienced doctors and specialists will provide expert advice and personalized treatment plans, helping you achieve your best possible health."
        />
      </div>
    </div>
  );
}

export default About;