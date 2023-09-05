import React, { useState, useEffect } from "react";
import FormInput from "./widgets/FormInput";
import { addContract, fetchOneContract } from "../services/api";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';


const NewContract = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const employerWallet = JSON.parse(localStorage.getItem("user")).wallet;
  const role = JSON.parse(localStorage.getItem("user")).role;
  const [employeeWallet, setEmployeeWallet] = useState("");
  const [employees, setEmployees] = useState([]);
  const [collateral, setCollateral] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetchOneContract(id);
        
        const start_date = new Date(response.start_from).toISOString().slice(0,-8);
        setIsEditable(new Date(response.start_from) > new Date());
  
        setEmployeeWallet(response.employee_wallet);
        setCollateral(response.collateral);
        setStartDate(start_date);
        // here you'll need to calculate end date from start date and duration
        setTotalAmount(response.total_amount);
      } catch (error) {
        console.error("Error fetching contract:", error);
      }
    };
    fetchContract();
  }, [id]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditable) {
      toast.error("You cannot edit a contract that has already started.");
      return;
    }
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
        role: role,
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
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex items-center justify-center w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Edit Contract
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {!isEditable && (
              <div className="alert alert-warning">
                Editing is not allowed because the contract has already started.
              </div>
            )}

            <FormInput
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              error={errors.startDate}
              disabled={!isEditable}
            />
            <FormInput
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              error={errors.endDate}
              disabled={!isEditable}
            />
            <FormInput
              id="totalAmount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="Total Amount"
              error={errors.totalAmount}
              disabled={!isEditable}
            />
            <FormInput
              id="collateral"
              type="number"
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              placeholder="Collateral"
              error={errors.collateral}
              disabled={!isEditable}
            />
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Contract
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewContract;
