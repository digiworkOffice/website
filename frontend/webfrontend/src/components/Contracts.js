import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getContractsByRoleAndId,
  updateContract,
  deleteContract,
  endContract,
} from "../services/api";
import Sidebar from "./Sidebar";
import {
  FaBars,
  FaEdit,
  FaPauseCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaTrash,
} from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Contracts = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [contracts, setContracts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [action, setAction] = useState("");

  const navigate = useNavigate();

  const handleEdit = (contractId) => {
    navigate(`/contracts/edit/${contractId}`);
  };

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
        await deleteContract(selectedContract._id);
        setContracts(
          contracts.filter((contract) => contract._id !== selectedContract._id)
        );
      } else if (action === "end") {
        const updatedContract = { ...selectedContract, status: "expired" };
        await endContract(updatedContract._id, updatedContract);
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
        await updateContract(updatedContract._id, updatedContract);
        setContracts(
          (contracts || []).map((contract) =>
            contract._id === updatedContract._id ? updatedContract : contract
          )
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getContractsByRoleAndId(user.role, user.wallet)
      .then((conts) => {
        setContracts(conts);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user.role, user.wallet]);

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 bg-indigo-600 text-white rounded-full fixed right-0 bottom-0 z-50"
      >
        <FaBars />
      </button>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="p-8 w-full">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-indigo-600 text-2xl font-semibold">Contracts</h2>
          <Link
            to="/contracts/new"
            className="text-white bg-indigo-600 p-2 rounded"
          >
            Add New Contract
          </Link>
        </div>
        <div className="w-full overflow-x-auto mt-4">
          <table className="table-auto w-full bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                {user.role !== "employer" && <th className="p-4">Employer</th>}
                {user.role !== "employee" && <th className="p-4">Employee</th>}
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
                  {user.role !== "employer" && (
                    <td className="p-4">{contract.employer_username}</td>
                  )}
                  {user.role !== "employee" && (
                    <td className="p-4">{contract.employee_username}</td>
                  )}
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
                      {user.role === "employer" &&
                      contract.status !== "expired" ? (
                        <>
                          <FaEdit
                            className="text-indigo-600 cursor-pointer"
                            onClick={() => handleEdit(contract._id)}
                          />
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
                        <FaTimesCircle className="text-red-600 cursor-pointer" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  );
};

export default Contracts;
