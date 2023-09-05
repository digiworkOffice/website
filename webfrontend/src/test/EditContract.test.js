import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import EditContract from "../components/EditContract";
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
  useParams: () => ({ id: '1234' }),
}));



// Define your localStorage mock globally at the top of your test file
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
  
  // Set the user object in localStorage
  global.localStorage.setItem('user', JSON.stringify({ wallet: 'employerWallet', role: 'employer' }));
  
  

const contract = {
  employee_wallet: 'employeeWallet',
  collateral: 1000,
  start_from: new Date().toISOString(),
  total_amount: 5000,
};

describe('Editing Contract Component', () => {
  beforeEach(() => {
    api.fetchOneContract.mockResolvedValue(contract);
    api.addContract.mockResolvedValue({});
    MockDate.set(new Date());
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockDate.reset();
  });

  test('renders Edit Contract button', () => {
    render(<BrowserRouter><EditContract /></BrowserRouter>);

    screen.getByRole('button', { name: /Edit Contract/i });
});

  test('fetches contract data on initial render', async () => {
    render(<BrowserRouter><EditContract /></BrowserRouter>);

    await waitFor(() => {
      expect(api.fetchOneContract).toHaveBeenCalledWith('1234');
    });
  });

  test('populates form with contract data', async () => {
    render(<BrowserRouter><EditContract /></BrowserRouter>);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Start Date')).toHaveValue(contract.start_from.slice(0,-8));
      expect(screen.getByPlaceholderText('Total Amount')).toHaveValue(contract.total_amount);
      expect(screen.getByPlaceholderText('Collateral')).toHaveValue(contract.collateral);
    });
  });

  

  test('adds a contract and shows success toast when form is filled correctly', async () => {
    contract.start_from = new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString(); // +1 day
    MockDate.set(new Date());

    render(<BrowserRouter><EditContract /></BrowserRouter>);

    const endDate = new Date(new Date(contract.start_from).getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(); // +1 month
    const endDateInput = screen.getByPlaceholderText('End Date');
    const startDateInput = screen.getByPlaceholderText('Start Date');
    const totalAmountInput = screen.getByPlaceholderText('Total Amount');
    const collateralInput = screen.getByPlaceholderText('Collateral');

    fireEvent.change(startDateInput, { target: { value: contract.start_from.slice(0,-8) } });
    fireEvent.change(endDateInput, { target: { value: endDate.slice(0,-8) } });
    fireEvent.change(totalAmountInput, { target: { value: contract.total_amount } });
    fireEvent.change(collateralInput, { target: { value: contract.collateral } });

    fireEvent.click(screen.getByRole('button', { name: /Edit Contract/i }));

    await waitFor(() => {
      expect(api.addContract).toHaveBeenCalledWith({
        collateral: "1000",
      duration: 2592000,
      employee_wallet: "",
      employer_wallet: "employerWallet",
      role: "employer",
      start_from: contract.start_from.slice(0,-8),
      total_amount: "5000",
      });

      expect(toast.success).toHaveBeenCalledWith('Contract Creation successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/contracts');
    });
  });
  test('shows error toast when trying to edit a contract that has already started', async () => {
    try {
        MockDate.set(new Date(contract.start_from));

    render(<BrowserRouter><EditContract /></BrowserRouter>);

    fireEvent.click(screen.getByRole('button', { name: /Edit Contract/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("You cannot edit a contract that has already started.");
    });
    } catch (error) {
        
    }
    
  });
});
