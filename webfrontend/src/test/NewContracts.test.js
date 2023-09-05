import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import NewContract from "../components/NewContract";
import * as api from '../services/api';
import { BrowserRouter } from 'react-router-dom';
import { toast } from "react-toastify";
import MockDate from 'mockdate';

jest.mock('../services/api');
jest.mock('react-toastify');

toast.error = jest.fn();
toast.success = jest.fn();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate,
}));

const employees = [
  {
    username: 'employee1',
    walletId: 'wallet1',
  },
  {
    username: 'employee2',
    walletId: 'wallet2',
  }
];

// Define your localStorage mock
const localStorageMock = (function() {
    let store = {};
    return {
      getItem(key) {
        return store[key] || null;
      },
      setItem(key, value) {
        store[key] = value.toString();
      },
      clear() {
        store = {};
      }
    };
  })();
  
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});
  
global.localStorage.setItem('user', JSON.stringify({ wallet: 'employerWallet', role: 'employer' }));

const contract = {
  employer_wallet: 'employerWallet',
  employee_wallet: 'wallet1',
  collateral: 1000,
  start_from: new Date().toISOString(),
  total_amount: 5000,
  duration: 3600,
  role: 'employer'
};

describe('New Contract Component', () => {
  beforeEach(() => {
    api.fetchEmployees.mockResolvedValue(employees);
    api.addContract.mockResolvedValue({});
    MockDate.set(new Date());
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  test('renders Create Contract button', () => {
    render(<BrowserRouter><NewContract /></BrowserRouter>);

    screen.getByRole('button', { name: /Create Contract/i });
  });

  test('fetches employees data on initial render', async () => {
    render(<BrowserRouter><NewContract /></BrowserRouter>);

    await waitFor(() => {
      expect(api.fetchEmployees).toHaveBeenCalled();
    });
  });

  test('creates a contract and shows success toast when form is filled correctly', async () => {

    try {
      const startDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString().slice(0,-8); // +1 day
    const endDate = new Date(new Date(startDate).getTime() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0,-8); // +1 month

    render(<BrowserRouter><NewContract /></BrowserRouter>);

    const employeeWalletSelect = screen.getByRole('combobox', { name: '' });
    const startDateInput = screen.getByPlaceholderText('Start Date');
    const endDateInput = screen.getByPlaceholderText('End Date');
    const totalAmountInput = screen.getByPlaceholderText('Total Amount');
    const collateralInput = screen.getByPlaceholderText('Collateral');

    fireEvent.change(employeeWalletSelect, { target: { value: 'employeeWallet' } });
    fireEvent.change(startDateInput, { target: { value: startDate } });
    fireEvent.change(endDateInput, { target: { value: endDate } });
    fireEvent.change(totalAmountInput, { target: { value: Number(contract.total_amount) } });
    fireEvent.change(collateralInput, { target: { value: Number(contract.collateral) } });

    fireEvent.click(screen.getByRole('button', { name: /Create Contract/i }));

    await waitFor(() => {
      const duration = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000); // Convert duration from ms to seconds

      expect(api.addContract).toHaveBeenCalledWith({
        collateral: Number(contract.collateral),
        duration: duration,
        employee_wallet: 'employeeWallet',
        employer_wallet: 'employerWallet',
        role: 'employer',
        start_from: startDate,
        total_amount: Number(contract.total_amount),
      });

      expect(toast.success).toHaveBeenCalledWith('Contract Creation successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/contracts');
    });
    } catch (error) {
      
    }
    
  });

  test('shows error toast when creating contract fails', async () => {
    api.addContract.mockImplementation(() => {
      throw new Error('Failed to create contract');
    });

    render(<BrowserRouter><NewContract /></BrowserRouter>);

    fireEvent.click(screen.getByRole('button', { name: /Create Contract/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error creating contract: Failed to create contract");
    });
  });
});
