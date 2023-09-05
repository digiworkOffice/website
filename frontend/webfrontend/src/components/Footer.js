import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-indigo-600 py-10 mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-white">
            <h3 className="text-lg mb-2">Talab. A payroll faucet</h3>
            <p className="text-sm">&copy; {new Date().getFullYear()} Talab. All Rights Reserved.</p>
          </div>
          <div className="space-x-4">
            <Link to="/about" className="text-indigo-200 hover:text-white transition-colors duration-300">
              About
            </Link>
            <Link to="/contact" className="text-indigo-200 hover:text-white transition-colors duration-300">
              Contact
            </Link>
            <Link to="/privacy" className="text-indigo-200 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
