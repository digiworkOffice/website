import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  updateContractAdmin,
  deleteContractAdmin,
  endContractAdmin,
} from "../services/api";
import {
  FaPauseCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaTrash,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [transactionAmount, setTransactionAmount] = useState([]);
  const [activeContracts, setActiveContracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [action, setAction] = useState("");
  const [employers, setEmployers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  const handlePause = (contract) => {
    setSelectedContract(contract);
    setAction("pause");
    setIsModalOpen(true);
  };

  const handleResume = (contract) => {
    setSelectedContract(contract);
    setAction("resume");
    setIsModalOpen(true);
  };

  const handleDelete = (contract) => {
    setSelectedContract(contract);
    setAction("delete");
    setIsModalOpen(true);
  };

  const handleEnd = (contract) => {
    setSelectedContract(contract);
    setAction("end");
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (action === "delete") {
        await deleteContractAdmin(selectedContract._id);
        setContracts(
          contracts.filter((contract) => contract._id !== selectedContract._id)
        );
      } else if (action === "end") {
        const updatedContract = { ...selectedContract, status: "expired" };
        await endContractAdmin(updatedContract._id, updatedContract);
        setContracts(
          contracts.map((contract) =>
            contract._id === updatedContract._id ? updatedContract : contract
          )
        );
      } else {
        const updatedContract = {
          ...selectedContract,
          status: action === "pause" ? "paused" : "active",
        };
        await updateContractAdmin(updatedContract._id, updatedContract);
        setContracts(
          contracts.map((contract) =>
            contract._id === updatedContract._id ? updatedContract : contract
          )
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(users);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the token
    navigate("/admin/login");
    toast.success("Logged Out successfully!");

    // redirect to login page
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const authConfig = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get("http://localhost:3001/api/admin/users", authConfig)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users", error));

    axios
      .get("http://localhost:3001/api/admin/users/employers", authConfig)
      .then((response) => setEmployers(response.data))
      .catch((error) => console.error("Error fetching employers", error));

    axios
      .get("http://localhost:3001/api/admin/users/employees", authConfig)
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error("Error fetching employees", error));

    axios
      .get("http://localhost:3001/api/admin/", authConfig)
      .then((response) => setContracts(response.data))
      .catch((error) => console.error("Error fetching contracts", error));

    axios
      .get("http://localhost:3001/api/admin/active", authConfig)
      .then((response) => setActiveContracts(response.data))
      .catch((error) =>
        console.error("Error fetching active contracts", error)
      );
    axios
      .get("http://localhost:3001/api/admin/totalTransactionAmount", authConfig)
      .then((response) =>
        setTransactionAmount(response.data.totalTransactionAmount)
      )
      .catch((error) =>
        console.error("Error fetching transaction  amount", error)
      );
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-semibold text-gray-700">
          Admin Dashboard
          {/* a button named Logout */}
          <button
            onClick={handleLogout}
            className="p-2 m-3 bg-indigo-600 text-white rounded-full fixed right-0 bottom-0 z-50"
          >
            Logout
          </button>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
          <div className="rounded bg-green-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{contracts.length}</h2>
              <p className="font-semibold">Contracts</p>
            </header>
          </div>
          <div className="rounded bg-red-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{activeContracts.length}</h2>
              <p className="font-semibold">Active Contracts</p>
            </header>
          </div>
          <div className="rounded bg-yellow-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{users.length}</h2>
              <p className="font-semibold">Users</p>
            </header>
          </div>
          <div className="rounded bg-pink-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{employers.length}</h2>
              <p className="font-semibold">Employers</p>
            </header>
          </div>
          <div className="rounded bg-gray-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{employees.length}</h2>
              <p className="font-semibold">Employees</p>
            </header>
          </div>

          <div className="rounded bg-blue-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">
                NPR{" "}
                {!isNaN(Number(transactionAmount))
                  ? Number(transactionAmount).toFixed(2)
                  : "0.00"}
              </h2>
              <p className="font-semibold">Transaction Amount</p>
            </header>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row h-screen bg-gray-50">
          <div className="p-8 w-full">
            <div className="flex justify-between items-center flex-wrap">
              <h2 className="text-indigo-600 text-2xl font-semibold">
                Contracts
              </h2>
            </div>
            <div className="w-full overflow-x-auto mt-4">
              <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="p-4">Employer</th>

                    <th className="p-4">Employee</th>
                    <th className="p-4">Created At</th>
                    <th className="p-4">Start From</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract, index) => (
                    <tr
                      key={contract._id}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      }`}
                    >
                      <td className="p-4">{contract.employer_username}</td>
                      <td className="p-4">{contract.employee_username}</td>
                      <td className="p-4">
                        {new Date(contract.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {new Date(contract.start_from).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex items-center justify-center">
                        <span
                          className={`h-3 w-3 rounded-full ${
                            contract.status === "active"
                              ? "bg-green-500"
                              : contract.status === "paused"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <div className="ml-2">{contract.status}</div>
                      </td>
                      <td className="p-4">
                        <Tooltip
                          title={`${contract.paid_up_amount} / ${contract.total_amount}`}
                        >
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                              <div
                                style={{
                                  width: `${
                                    (contract.paid_up_amount /
                                      contract.total_amount) *
                                    100
                                  }%`,
                                }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                              ></div>
                            </div>
                          </div>
                        </Tooltip>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {contract.status !== "expired" ? (
                            <>
                              {contract.status === "active" ? (
                                <FaPauseCircle
                                  className="text-yellow-600 cursor-pointer"
                                  onClick={() => handlePause(contract)}
                                />
                              ) : (
                                <FaPlayCircle
                                  className="text-green-600 cursor-pointer"
                                  onClick={() => handleResume(contract)}
                                />
                              )}
                              <FaTrash
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDelete(contract)}
                              />
                              <FaTimesCircle
                                className="text-gray-600 cursor-pointer"
                                onClick={() => handleEnd(contract)}
                              />
                            </>
                          ) : (
                            <FaTimesCircle
                              className="text-red-600 cursor-pointer"
                              onClick={() => handleDelete(contract)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-1 w-full">
                <h2 className="text-indigo-600 text-2xl font-semibold">
                  Users
                </h2>
                <div className="w-full overflow-x-auto mt-4">
                  <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="p-4">Full Name</th>
                        <th className="p-4">Username</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Gender</th>
                        <th className="p-4">Date of Birth</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Created At</th>
                        {/* Add any other fields you want to display here */}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`border-b ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                          }`}
                        >
                          <td className="p-4">{user.fullname}</td>
                          <td className="p-4">{user.username}</td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">{user.gender}</td>
                          <td className="p-4">
                            {new Date(user.dob).toLocaleDateString()}
                          </td>
                          <td className="p-4">{user.phone}</td>
                          <td className="p-4">{user.address}</td>
                          <td className="p-4">{user.role}</td>
                          <td className="p-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          {/* Add cells for any other fields you want to display here */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {isModalOpen && selectedContract && (
            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              contentLabel="Contract Action Confirmation"
              className="m-auto bg-white p-6 rounded-md shadow-lg w-full sm:w-4/5 md:w-1/2 lg:w-1/3 max-w-screen-sm mx-auto mt-20"
            >
              <h2 className="text-xl font-semibold mb-6">
                {`Are you sure you want to ${action} this contract?`}
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={confirmAction}
                >
                  Confirm
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
