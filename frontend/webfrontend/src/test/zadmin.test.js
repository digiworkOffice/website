
import { render, fireEvent, screen } from "@testing-library/react";
import AdminDashboard from "../components/AdminDashboard";
import { updateContractAdmin, deleteContractAdmin, endContractAdmin } from "../services/api";
import axios from 'axios';
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");
jest.mock("../services/api");

// Mocked contract
const mockContract = {
  _id: "1",
  employer_username: "employer1",
  employee_username: "employee1",
  created_at: new Date(),
  start_from: new Date(),
  status: "active",
  total_amount: 5000,
  paid_up_amount: 3000,
};

describe("AdminDashboard", () => {

  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    window.localStorage = {
      getItem: jest.fn(() => "mockToken"),
      removeItem: jest.fn(),
    };
    axios.get.mockResolvedValue({
      data: [mockContract]
    });
  });

  it("should pause a contract when the pause icon is clicked", async () => {
    updateContractAdmin.mockResolvedValue();
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    fireEvent.click(screen.getByTestId(`pause-${mockContract._id}`));
    fireEvent.click(screen.getByTestId('confirm-action'));

    expect(updateContractAdmin).toHaveBeenCalledWith(mockContract._id, {...mockContract, status: 'paused'});
  });

  it("should resume a paused contract when the resume icon is clicked", async () => {
    updateContractAdmin.mockResolvedValue();
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    fireEvent.click(screen.getByTestId(`resume-${mockContract._id}`));
    fireEvent.click(screen.getByTestId('confirm-action'));

    expect(updateContractAdmin).toHaveBeenCalledWith(mockContract._id, {...mockContract, status: 'active'});
  });

  it("should delete a contract when the delete icon is clicked", async () => {
    deleteContractAdmin.mockResolvedValue();
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    fireEvent.click(screen.getByTestId(`delete-${mockContract._id}`));
    fireEvent.click(screen.getByTestId('confirm-action'));

    expect(deleteContractAdmin).toHaveBeenCalledWith(mockContract._id);
  });

  it("should end a contract when the end icon is clicked", async () => {
    endContractAdmin.mockResolvedValue();
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    fireEvent.click(screen.getByTestId(`end-${mockContract._id}`));
    fireEvent.click(screen.getByTestId('confirm-action'));

    expect(endContractAdmin).toHaveBeenCalledWith(mockContract._id, {...mockContract, status: "expired"});
  });

  it('should handle pause', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    // Assume contract with id "1" is to be paused
    const pauseButton = screen.getByTestId(`pause-1`);
    fireEvent.click(pauseButton);

    // Assert that the modal is open
    expect(screen.getByTestId('modal')).toBeVisible();
  });

  // handleResume function
  it('should handle resume', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    // Assume contract with id "1" is to be resumed
    const resumeButton = screen.getByTestId(`resume-1`);
    fireEvent.click(resumeButton);

    // Assert that the modal is open
    expect(screen.getByTestId('modal')).toBeVisible();
  });

  // handleDelete function
  it('should handle delete', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    // Assume contract with id "1" is to be deleted
    const deleteButton = screen.getByTestId(`delete-1`);
    fireEvent.click(deleteButton);

    // Assert that the modal is open
    expect(screen.getByTestId('modal')).toBeVisible();
  });

  // handleEnd function
  it('should handle end', async () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    // Assume contract with id "1" is to be ended
    const endButton = screen.getByTestId(`end-1`);
    fireEvent.click(endButton);

    // Assert that the modal is open
    expect(screen.getByTestId('modal')).toBeVisible();
  });

  // handleLogout function
  it('should handle logout', () => {
    render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
    
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);

    // Assert that the token is removed from localStorage
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('should handle confirmAction with delete action', async () => {
    const mockId = '1';
    const mockContract = { _id: mockId };
    const deleteContractAdmin = jest.fn().mockResolvedValue();
    const setSelectedContract = jest.fn();
    const setAction = jest.fn();
    const setIsModalOpen = jest.fn();
    const setContracts = jest.fn();
  
    // Setup the component with the mock functions and initial state
    render(<BrowserRouter><AdminDashboard setSelectedContract={setSelectedContract} setAction={setAction} setIsModalOpen={setIsModalOpen} setContracts={setContracts} contracts={[mockContract]} /></BrowserRouter>);
  
    // Trigger the delete action
    const deleteButton = screen.getByTestId(`delete-${mockId}`);
    fireEvent.click(deleteButton);
    
    // Trigger the confirmation
    const confirmButton = screen.getByTestId('confirm-action');
    fireEvent.click(confirmButton);
    
    // Wait for any asynchronous actions to complete
    await waitFor(() => expect(deleteContractAdmin).toHaveBeenCalled());
  
    // Assert that the correct actions were taken
    expect(deleteContractAdmin).toHaveBeenCalledWith(mockId);
    expect(setContracts).toHaveBeenCalledWith([]);
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });
  
});
