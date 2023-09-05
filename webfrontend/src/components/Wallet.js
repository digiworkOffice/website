import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getWalletById, updateWalletBalance } from '../services/api';
import { toast } from "react-toastify";

const Wallet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    getWalletById(user.wallet, localStorage.getItem("token"))
      .then((data) => setBalance(data.balance))
      .catch((err) => toast.error(err));
  }, [user.wallet]);

  const handleAddMoney = (e) => {
    e.preventDefault();
    const newBalance = balance + amount;
    updateWalletBalance(user.wallet, newBalance, localStorage.getItem("token"))
      .then((data) => setBalance(data.balance), toast.success('Wallet balance updated'))
      .catch((err) => toast.error(err));
  };

  const handleDeductMoney = (e) => {
    e.preventDefault();
    if (balance < amount) {
      alert('Insufficient balance for withdrawal');
    } else {
      const newBalance = balance - amount;
      updateWalletBalance(user.wallet, newBalance, localStorage.getItem("token"))
        .then((data) => setBalance(data.balance), toast.success('Wallet balance updated'))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 bg-indigo-600 text-white rounded-full fixed right-0 bottom-0 z-50"
      >
        {isOpen ? <FaBars /> : <FaBars />}
      </button>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-96">
            <div className="text-2xl font-semibold text-gray-700">Wallet</div>
            <div className="text-gray-500">Balance: NPR {balance}</div>

            <div className="flex flex-col mt-4">
              <label className="font-medium">{user.role === 'employer' ? 'Add Money:' : 'Withdraw Money:'}</label>
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  className="border-2 rounded-md p-2 mr-2 flex-grow"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <button
                  className={user.role === 'employer' ? "bg-indigo-600 text-white px-4 py-2 rounded" : "bg-red-600 text-white px-4 py-2 rounded"}
                  onClick={user.role === 'employer' ? handleAddMoney : handleDeductMoney}
                >
                  {user.role === 'employer' ? 'Add' : 'Withdraw'}
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-purple-800 text-white px-4 py-2 rounded"
                onClick={() => navigate("/khalti")}
              >
                Khalti
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/esewa")}
              >
                eSewa
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/imepay")}
              >
                IME Pay
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                // onClick={() => history.push("/demo")}
              >
                Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
