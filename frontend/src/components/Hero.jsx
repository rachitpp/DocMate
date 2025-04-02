import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate  } from "react-router-dom";
import "../Styles/Hero.css";

function Hero() {
  const navigate = useNavigate();
  const [goUp, setGoUp] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAppointmentClick = () => {
    navigate("/appointment");
  };

  useEffect(() => {
    const onPageScroll = () => {
      if (window.scrollY > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <div className="section-container">
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 via-transparent to-transparent pb-12 pt-20 sm:pb-16 sm:pt-32 lg:pb-24 xl:pb-32 xl:pt-40">
        <div className="relative z-10">
          <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
            <svg className="h-[60rem] w-[100rem] flex-none stroke-green-600 opacity-20" aria-hidden="true">
              <defs>
                <pattern id="e9033f3e-f665-41a6-84ef-756f6778e6fe" width="200" height="200" x="50%" y="50%"
                  patternUnits="userSpaceOnUse" patternTransform="translate(-100 0)">
                    <path d="M.5 200V.5H200" fill="none"></path> 
                </pattern>
              </defs>
              <svg x="50%" y="50%" class="overflow-visible fill-green-50">
                <path d="M-300 0h201v201h-201Z M300 200h201v201h-201Z" stroke-width="0"></path>
              </svg>
              <rect width="100%" height="100%" stroke-width="0" fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)">
               </rect>
            </svg>
        </div>
    </div>
    <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-green-500 sm:text-6xl">
                💚 Health comes first
            </h1>
            <h2 className="text-blue-500 mt-10 text-xl font-bold">Find your Doctor and make an Appointments</h2>

            <h2 className="mt-6 text-lg leading-8 text-gray-600 font-medium">
            Talk to online doctors and get medical advice, online prescriptions,
            refills and medical notes within minutes. On-demand healthcare
            services at your fingertips.
            </h2>
            <div class="mt-10 flex items-center justify-center gap-x-6">
            <button
            className="btn btn-success font-bold bg-green-500 text-white btn-md"
            type="button"
            onClick={handleBookAppointmentClick}
          >
            <FontAwesomeIcon icon={faCalendarCheck} className="font-bold" /> Book Appointment
          </button>
            </div>
        </div>
        <div className="relative mx-auto mt-10 max-w-lg">
            <img className="w-full rounded-2xl shadow-xl" src="https://demigos.com/media/cache/cf/ef/cfef9283bb2f3f26a749ed4d74113b56.jpg" alt="" />
        </div>
      <section className="p-6 border bg-[rgb(249,250,250)] mt-12 rounded-xl shadow-xl text-green-500">
	  <div className="container mx-auto grid justify-center grid-cols-2 text-center lg:grid-cols-3">
		  <div className="flex flex-col justify-start m-2 lg:m-6">
			  <p className="text-4xl font-bold leading-none lg:text-6xl">150+</p>
			  <p className="text-sm sm:text-lg mt-2 font-medium">Clients</p>
		  </div>
		  <div className="flex flex-col justify-start m-2 lg:m-6">
			  <p className="text-4xl font-bold leading-none lg:text-6xl">20K</p>
			  <p className="text-sm sm:text-lg mt-2 font-medium">Followers on social media</p>
		  </div>
		  <div className="flex flex-col justify-start m-2 lg:m-6">
			  <p className="text-4xl font-bold leading-none lg:text-6xl">20+</p>
			  <p className="text-sm sm:text-lg mt-2 font-medium">Expert Doctors</p>
		  </div>
		  <div className="flex flex-col justify-start m-2 lg:m-6">
			  <p className="text-4xl font-bold leading-none lg:text-6xl">8</p>
			  <p className="text-sm sm:text-lg mt-2 font-medium">TED talks</p>
		  </div>
		  <div className="flex flex-col justify-start m-2 lg:m-6">
			  <p className="text-4xl font-bold leading-none lg:text-6xl">10+</p>
			  <p className="text-sm sm:text-lg mt-2 font-medium">Years of experience</p>
		  </div>
		  <div className="flex flex-col justify-start m-2 lg:m-6">
			  <p className="text-4xl font-bold leading-none lg:text-6xl">10+</p>
			  <p className="text-sm sm:text-lg mt-2 font-medium">Workshops</p>
		  </div>
	    </div>
    </section>
    </div>
    </section>
    <div onClick={scrollToTop} className={`scroll-up ${goUp ? "show-scroll" : ""}`}>
      <FontAwesomeIcon icon={faAngleUp} />
    </div>
  </div>
  );
}

export default Hero;
