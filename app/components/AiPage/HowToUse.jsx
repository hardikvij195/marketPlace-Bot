import React from "react";

const HowToUsePage = () => {
  return (
    <div className="min-h-screen w-full bg-white py-10 px-4 md:px-12 lg:px-24 flex flex-col items-center space-y-12">
      {/* Header Section */}
      <section className="text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          How to Use
        </h2>
        <p className="text-lg text-gray-700">
          Follow these simple steps to get started with your subscription and dashboard features.
        </p>
      </section>

      {/* Steps Section */}
      <section className="max-w-3xl w-full">
        <ol className="list-decimal list-inside space-y-6 text-gray-700 text-lg">
          <li>Sign up or log in to your account.</li>
          <li>Choose a subscription plan that suits your needs.</li>
          <li>Access your dashboard and start exploring features.</li>
          <li>Follow the video tutorial below for a step-by-step guide.</li>
        </ol>
      </section>

      {/* Video Section */}
      <section className="w-full flex justify-center">
        <div className="max-w-3xl w-full">
          <video
            className="w-full h-[50vh] rounded-xl shadow-lg border border-gray-200"
            controls
            src="/tutorial.mp4"
            poster="/video-poster.png"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
};

export default HowToUsePage;
