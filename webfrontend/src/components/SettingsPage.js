import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { deactivateAccount } from "../services/api";
import { useNavigate } from "react-router-dom" ;

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmDeactivation, setConfirmDeactivation] = useState('');
  const [checkedTerms, setCheckedTerms] = useState(false);
  const navigate = useNavigate();

  const handleDeactivateAccount = async () => {
    const token = localStorage.getItem("token");

    // Deactivate user account
    await deactivateAccount(token);

    // Clear local storage
    localStorage.clear();

    // Redirect to the registration page
    navigate('/register');
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 bg-indigo-600 text-white rounded-full fixed right-0 bottom-0 z-50"
      >
        <FaBars />
      </button>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="w-full sm:w-3/4 md:w-1/2 mx-auto p-8">
        <h2 className="text-indigo-600 text-2xl font-semibold mb-6 text-center">Settings</h2>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center">
            <button
              className="mb-4 bg-red-500 text-white rounded px-4 py-2"
              onClick={() => setShowModal(true)}
            >
              Deactivate Account
            </button>
          </div>

          {showModal && (
            <div className="modal bg-white p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Confirm Deactivation</h3>
              <p>Are you sure you want to deactivate your account?</p>

              <input
                type="text"
                placeholder="Type 'CONFIRM' to deactivate"
                className="border mt-4 p-2 rounded w-full"
                onChange={(e) => setConfirmDeactivation(e.target.value)}
              />

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="mr-2"
                  checked={checkedTerms}
                  onChange={() => setCheckedTerms(!checkedTerms)}
                />
                <label htmlFor="terms">I have read and accept the terms of deactivation.</label>
              </div>

              <button
                className="bg-red-500 text-white rounded px-4 py-2 mt-4"
                disabled={!(confirmDeactivation === 'CONFIRM' && checkedTerms)}
                onClick={handleDeactivateAccount}
              >
                Deactivate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
