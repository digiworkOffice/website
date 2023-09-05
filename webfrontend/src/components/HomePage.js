import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png'; // Import your logo here


const HomePage = () => {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate("/register");
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="text-gray-700 body-font">
          <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
            <img
              src={logo}
              alt="Company Logo"
              className="w-24 h-24 mb-4 rounded-full"
            />{" "}
            {/* Add your logo here */}
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              TALAB : A Payroll Faucet
            </h1>
            <p className="mb-8 leading-relaxed">
              Every second counts. Time is money.
            </p>
            <div className="flex justify-center">
              <button
                className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                onClick={handleStart}
              >
                Roll Now !
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-gray-700 body-font py-24 bg-gray-100">
          <div className="container px-5 mx-auto flex flex-wrap">
            {/* Feature 1 */}
            <div className="flex flex-wrap w-full mb-10">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h2 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                  Seamless transactions
                </h2>
                <p className="leading-relaxed text-base">
                  Hassle free way to pay your employees. No more waiting for the
                  bank to process your transactions.
                </p>
              </div>
            </div>
            {/* Feature 2 */}
            <div className="flex flex-wrap w-full mb-10">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h2 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                  Contract based payments
                </h2>
                <p className="leading-relaxed text-base">
                  Create contracts with your employees and pay them accordingly.
                  No more manual calculations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-gray-700 body-font py-24">
          <div className="container mx-auto flex px-5 flex-col items-center justify-center">
            <h2 className="text-3xl mb-4 font-medium text-gray-900">
              Ready to get started?
            </h2>
            <div className="flex justify-center">
              <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                JOIN NOW!
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
