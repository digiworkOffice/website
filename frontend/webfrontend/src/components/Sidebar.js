import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaBars, FaHome, FaFileContract, FaWallet, FaCog, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // remove the token
    navigate('/login');
    toast.success("Logged Out successfully!");

     // redirect to login page
  }


  return (
    <div className={`fixed z-50 top-0 right-0 h-full overflow-auto bg-indigo-600 w-64 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-200 ease-in-out`}>
      <div className="flex items-center justify-between p-6">
        <h2 className="text-white text-2xl font-semibold">Talab</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <nav>
        <ul>
          <li className="flex items-center p-4 hover:bg-indigo-500">
            <FaHome className="mr-2"/> 
            {isOpen && <Link to="/dashboard" className="text-white">Dashboard</Link>}
          </li>
          <li className="flex items-center p-4 hover:bg-indigo-500">
            <FaFileContract className="mr-2"/> 
            {isOpen && <Link to="/contracts" className="text-white">Contracts</Link>}
          </li>
          <li className="flex items-center p-4 hover:bg-indigo-500">
            <FaWallet className="mr-2"/> 
            {isOpen && <Link to="/wallet" className="text-white">Wallet</Link>}
          </li>
          <li className="flex items-center p-4 hover:bg-indigo-500">
            <FaCog className="mr-2"/> 
            {isOpen && <Link to="/settings" className="text-white">Settings</Link>}
          </li>
          <li className="flex items-center p-4 hover:bg-indigo-500">
            <FaUserAlt className="mr-2"/> 
            {isOpen && <Link to="/profile" className="text-white">Profile</Link>}
          </li>
          <li className="flex items-center p-4 hover:bg-indigo-500">
            <FaSignOutAlt className="mr-2"/> 
            {isOpen && <button onClick={handleLogout} className="text-white">Log Out</button>}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
