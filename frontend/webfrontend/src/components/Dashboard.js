import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import {
  getContractsByRoleAndId,
} from "../services/api";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [contracts, setContracts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [totalContracts, setTotalContracts] = useState(0);
  const [activeContracts, setActiveContracts] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  // Calculate Chart Data
  let statusData = [
    { name: "Active", value: 0 },
    { name: "Halted", value: 0 },
    { name: "Expired", value: 0 },
    { name: "Paused", value: 0 },
  ];
  let totalPaid = 0;
  let totalAmount = 0;
  let activeContractsCount = 0;
  let nonActiveContractsCount = 0;
  let totalLength = 0;
  let totalPay = 0;

  contracts.forEach((contract) => {
    if (contract.status === "active") activeContractsCount++;
    else nonActiveContractsCount++;

    statusData.find((item) => item.name.toLowerCase() === contract.status)
      .value++;

    totalPaid += contract.paid_up_amount;
    totalAmount += contract.total_amount;

    let startDate = new Date(contract.start_from);
    let endDate = contract.end_date ? new Date(contract.end_date) : new Date();
    totalLength += (endDate - startDate) / 1000 / 60; // Length in minutes
    totalPay += contract.total_amount;
  });

  let paidPercentageData = [
    { name: "Paid", value: totalPaid },
    { name: "Unpaid", value: totalAmount - totalPaid },
  ];
  let activeStatusData = [
    { name: "Active", value: activeContractsCount },
    { name: "Non-Active", value: nonActiveContractsCount },
  ];
  let averageLength = totalLength / contracts.length;
  let averagePay = totalPay / contracts.length;
  let averagePayPerMinute = totalPay / totalLength;
  useEffect(() => {
    getContractsByRoleAndId(user.role, user.wallet)
      .then((conts) => {
        setContracts(conts);

        // Set Total Contracts
        setTotalContracts(conts.length);

        // Set Active Contracts
        setActiveContracts(
          conts.filter((contract) => contract.is_active).length
        );

        // Set Unique Users (employers if the user is an employee, and vice versa)
        const usersSet = new Set();
        conts.forEach((contract) =>
          usersSet.add(
            user.role === "employer"
              ? contract.employee_wallet
              : contract.employer_wallet
          )
        );
        setUniqueUsers(usersSet.size);

        // Calculate Revenue
        const revenueAmount = conts.reduce(
          (total, contract) => total + contract.paid_up_amount,
          0
        );
        setRevenue(revenueAmount.toFixed(2));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user.role, user.wallet]);

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
    <div className="flex h-screen bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 bg-indigo-600 text-white rounded-full fixed right-0 bottom-0 z-50"
      >
        {isOpen ? <FaBars /> : <FaBars />}
      </button>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-semibold text-gray-700">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 gap-4">
          <div className="rounded bg-red-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{totalContracts}</h2>
              <p className="font-semibold">Contracts</p>
            </header>
          </div>
          <div className="rounded bg-blue-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{activeContracts}</h2>
              <p className="font-semibold">Active Contracts</p>
            </header>
          </div>
          <div className="rounded bg-purple-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">{uniqueUsers}</h2>
              <p className="font-semibold">Clients</p>
            </header>
          </div>
          <div className="rounded bg-yellow-600 p-4 text-white shadow-md">
            <header>
              <h2 className="text-3xl font-bold">NPR {revenue}</h2>
              <p className="font-semibold">Revenue</p>
            </header>
          </div>
        </div>

        <div className="p-8 w-full">
          <div className="flex justify-between items-center flex-wrap">
            <h2 className="text-indigo-600 text-2xl font-semibold">
              Contracts
            </h2>
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
                  {user.role !== "employer" && (
                    <th className="p-4">Employer</th>
                  )}
                  {user.role !== "employee" && (
                    <th className="p-4">Employee</th>
                  )}
                  <th className="p-4">Created At</th>
                  <th className="p-4">Start From</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 mt-8">
          <ChartComponent title="Contracts Status" data={statusData} />
          <ChartComponent title="Paid Percentage" data={paidPercentageData} />
          <ChartComponent
            title="Active vs Non-Active"
            data={activeStatusData}
          />
          <div className="shadow-md bg-white p-6 rounded-md space-y-6">
            <header>
              <h2 className="text-2xl font-semibold">Averages</h2>
            </header>
            <div>
              <p>Average Contract Length: {averageLength.toFixed(2)} minutes</p>
              <p>Average Pay per Contract: NPR {averagePay.toFixed(2)}</p>
              <p>
                Average Pay per Minute: NPR {averagePayPerMinute.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ChartComponent = ({ title, data }) => (
  <div className="shadow-md bg-white p-6 rounded-md space-y-6">
    <header>
      <h2 className="text-2xl font-semibold">{title}</h2>
    </header>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          labelLine={false}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <RechartsTooltip
          formatter={(value) => [value, "Value"]}
          labelFormatter={(name) => [`${name}`]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default Dashboard;
