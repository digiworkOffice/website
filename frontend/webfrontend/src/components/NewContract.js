import React, { useState, useEffect } from "react";
import FormInput from "./widgets/FormInput";
import { addContract, fetchEmployees } from "../services/api";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewContract = () => {
  const navigate = useNavigate();
  const employerWallet = JSON.parse(localStorage.getItem("user")).wallet;
  const role = JSON.parse(localStorage.getItem("user")).role;
  const [employeeWallet, setEmployeeWallet] = useState("");
  const [employees, setEmployees] = useState([]);
  const [collateral, setCollateral] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const response = await fetchEmployees();
        console.log(response); // logging the raw response
        if (response && response.length > 0) {
          setEmployees(response);
        } else {
          console.error("No data returned from API");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    getEmployees();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
    const duration =
      new Date(endDate).getTime() - new Date(startDate).getTime();
    const contract = {
      employer_wallet: employerWallet,
      employee_wallet: employeeWallet, // you can map this from employees by username
      collateral,
      duration: Math.round(duration / 1000), // Convert duration from ms to seconds
      start_from: startDate,
      total_amount: totalAmount,
      role: role
    };
    await addContract(contract);
      //route to /contracts using react router
      toast.success("Contract Creation successful!");
      navigate("/contracts");
      
    } catch (error) {
      console.error(error);
      toast.error("Error creating contract: " + error.message);
    }
  };
  console.log(employees);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create New Contract
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <select
              id="employeeWallet"
              value={employeeWallet}
              onChange={(e) => setEmployeeWallet(e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select Employee</option>
              {employees &&
                employees.map((employee) => (
                  <option key={employee.username} value={employee.walletId}>
                    {employee.username}
                  </option>
                ))}
            </select>

            <FormInput
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              error={errors.startDate}
            />
            <FormInput
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              error={errors.endDate}
            />
            <FormInput
              id="totalAmount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Total Amount"
              error={errors.totalAmount}
            />
            <FormInput
              id="collateral"
              type="number"
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="Collateral"
              error={errors.collateral}
            />
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewContract;
