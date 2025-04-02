import React, { useState } from "react";
import { customerReviews } from "../Scripts/reviews";
import "../Styles/Reviews.css";

function Reviews() {
  let rMessage, rName, rLocation;
  const reviewsLength = customerReviews.length - 1;
  const [review, setReview] = useState(0);

  // back to previous review
  const backBtnClick = () => {
    setReview(review <= 0 ? reviewsLength : review - 1);
    handleReviewsUpdation();
  };

  // go to newer review
  const frontBtnClick = () => {
    setReview(review >= reviewsLength ? 0 : review + 1);
    handleReviewsUpdation();
  };

  // update reviews
  const handleReviewsUpdation = () => {
    const reviewMessage = customerReviews[review];
    rName = reviewMessage.name;
    rLocation = reviewMessage.location;
    rMessage = reviewMessage.message;
  };

  // list review on visit
  handleReviewsUpdation();

  return (
    <div>
      <section className="my-8">
	<div className="container flex flex-col items-center mx-auto mb-12 md:p-10 md:px-12">
		<h1 className="p-4 text-4xl font-extrabold leading-none text-center text-green-500">What our customers are saying about us</h1>
	</div>
	<div className="container flex flex-col items-center justify-center mx-auto lg:flex-row lg:flex-wrap lg:justify-evenly lg:px-10">
		<div className="flex flex-col max-w-sm mx-4 my-6 shadow-lg border rounded-lg bg-[#F8F8FF]">
			<div className="px-4 py-8 rounded-t-lg sm:px-8 md:px-12">
				<p className="relative px-6 py-1 text-lg italic text-center text-green-500 font-semibold">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
						<path d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
						<path d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
					</svg>Docmate transformed my healthcare experience! The online consultations were so convenient, and the doctors were knowledgeable and caring.
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute right-0 w-8 h-8">
						<path d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
						<path d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
					</svg>
				</p>
			</div>
			<div className="flex flex-col items-center justify-center p-8 rounded-b-lg bg-green-400 text-white">
				<img src="https://images.unsplash.com/photo-1645830166230-187caf791b90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGF2YXRhciUyMGluZGlhbnxlbnwwfHwwfHx8MA%3D%3D" alt="" className="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full dark:bg-gray-500 dark:bg-gray-300" />
				<p className="text-xl font-semibold leading-tight">Ram Prasad</p>
				<p className="text-sm">New Delhi, India</p>
			</div>
		</div>
		<div className="flex flex-col max-w-sm mx-4 my-6 shadow-lg border rounded-lg bg-[#F8F8FF]">
			<div className="px-4 py-12 rounded-t-lg sm:px-8 md:px-12">
				<p className="relative px-6 py-1 text-lg italic text-center text-green-500 font-semibold">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
						<path d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
						<path d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
					</svg>Booking appointments was a breeze, and the service exceeded my expectations. The doctors truly listen and provide effective solutions.
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute right-0 w-8 h-8">
						<path d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
						<path d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
					</svg>
				</p>
			</div>
			<div className="flex flex-col items-center justify-center p-8 rounded-b-lg bg-green-400 text-white">
				<img src="https://source.unsplash.com/50x50/?portrait?19" alt="" className="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full" />
				<p className="text-xl font-semibold leading-tight">Rohit Sharma</p>
				<p className="text-sm">Mumbai, India</p>
			</div>
		</div>
		<div className="flex flex-col max-w-sm mx-4 my-6 shadow-lg border rounded-lg bg-[#F8F8FF]">
			<div className="px-4 py-12 rounded-t-lg sm:px-8 md:px-12 dark:bg-gray-50">
				<p className="relative px-6 py-1 text-lg italic text-center text-green-500 font-semibold dark:text-gray-800">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
						<path d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
						<path d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
					</svg>DocMate is a game-changer! The emergency care saved me during a critical situation. Grateful for their quick and efficient support.
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute right-0 w-8 h-8">
						<path d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
						<path d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
					</svg>
				</p>
			</div>
			<div className="flex flex-col items-center justify-center p-8 rounded-b-lg bg-green-400 text-white">
				<img src="https://source.unsplash.com/50x50/?portrait?9" alt="" className="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full" />
				<p className="text-xl font-semibold leading-tight">Bob Johnson</p>
				<p className="text-sm">Florida, USA</p>
			</div>
		</div>
		<div className="flex flex-col max-w-sm mx-4 my-6 shadow-lg border rounded-lg bg-[#F8F8FF]">
			<div className="px-4 py-12 rounded-t-lg sm:px-8 md:px-12">
				<p className="relative px-6 py-1 text-lg italic text-center text-green-500 font-semibold ">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
						<path d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
						<path d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
					</svg>I used to dread dental visits, but Health Plus made it a pleasant experience. The dentist was gentle and professional. I'll definitely be back!
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute right-0 w-8 h-8">
						<path d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
						<path d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
					</svg>
				</p>
			</div>
			<div className="flex flex-col items-center justify-center p-8 rounded-b-lg bg-green-400 text-white">
				<img src="https://source.unsplash.com/50x50/?portrait?5" alt="" className="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full" />
				<p className="text-xl font-semibold leading-tight">Jane Brown</p>
				<p className="text-sm">Washington, USA</p>
			</div>
		</div>
		<div className="flex flex-col max-w-sm mx-4 my-6 shadow-lg border rounded-lg bg-[#F8F8FF]">
			<div className="px-4 py-12 rounded-t-lg sm:px-8 md:px-12">
				<p className="relative px-6 py-1 text-lg italic text-center text-green-500 font-semibold dark:text-gray-800">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-8 h-8">
						<path d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"></path>
						<path d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"></path>
					</svg>The convenience of accessing medical notes online was fantastic. Health Plus made managing my health records hassle-free! Best Healthcare services.
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="absolute right-0 w-8 h-8">
						<path d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"></path>
						<path d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"></path>
					</svg>
				</p>
			</div>
			<div className="flex flex-col items-center justify-center p-8 rounded-b-lg bg-green-400 text-white">
				<img src="https://source.unsplash.com/50x50/?portrait?3" alt="" className="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full" />
				<p className="text-xl font-semibold leading-tight">Sarah Thomas</p>
				<p className="text-sm">California, USA</p>
			</div>
		</div>
	</div>
</section>
    </div>
  );
}

export default Reviews;
