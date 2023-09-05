import React, { useState, useEffect } from "react";
import { FaBars, FaEdit } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { validateToken, updateUser, uploadProfilePic } from "../services/api";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [userPhoto, setUserPhoto] = useState(userData.photo);
  const [editMode, setEditMode] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    validateToken(token)
      .then((data) => {
        if (data.user) {
          setUserData(data.user);
          setUserPhoto(data.user.photo);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");

    // Update user data
    const updatedUserData = await updateUser(userData._id, userData, token); 
    setUserData(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));

    setEditMode(false);
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    uploadProfilePic(file)
      .then((response) => {
        setUserPhoto(response.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
        <h2 className="text-indigo-600 text-2xl font-semibold mb-6 text-center">Profile</h2>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="relative"
            >
              {userPhoto ? (
                <img
                  src={`http://localhost:3001/public/uploads/profilepictures/${userPhoto}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-lg text-gray-400">No Image</span>
                </div>
              )}

              {hovered && (
                <label className="absolute bottom-0 left-0 bg-indigo-600 text-white rounded-full p-1 cursor-pointer">
                  <FaEdit />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            <button
              className="mb-4 bg-indigo-600 text-white rounded px-4 py-2"
              onClick={() => setEditMode(!editMode)}
            >
              Edit Profile
            </button>

            <div className="flex flex-col w-full mt-4">
              {editMode ? (
                <>
                  <input
                    type="text"
                    defaultValue={userData.fullname}
                    className="border mb-4 p-2 rounded w-full"
                    onChange={(e) =>
                      setUserData({ ...userData, fullname: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    defaultValue={userData.dob}
                    className="border mb-4 p-2 rounded w-full"
                    onChange={(e) =>
                      setUserData({ ...userData, dob: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    defaultValue={userData.address}
                    className="border mb-4 p-2 rounded w-full"
                    onChange={(e) =>
                      setUserData({ ...userData, address: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    defaultValue={userData.phone}
                    className="border mb-4 p-2 rounded w-full"
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                  />
                  <button
                    className="bg-indigo-600 text-white rounded px-4 py-2"
                    onClick={handleUpdateUser}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                    <span className="font-semibold">Name</span>
                    <span>{userData.fullname}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                    <span className="font-semibold">Date of Birth</span>
                    <span>{new Date(userData.dob).toISOString().slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                    <span className="font-semibold">Address</span>
                    <span>{userData.address}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg mb-2">
                    <span className="font-semibold">Phone</span>
                    <span>{userData.phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
