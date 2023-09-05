import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Settings from "../components/SettingsPage";
import * as api from '../services/api';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/api');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate,
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Settings Component', () => {
  beforeEach(() => {
    api.deactivateAccount = jest.fn();
    localStorageMock.getItem.mockReturnValue('test_token');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Deactivate Account button', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);

    expect(screen.getByText('Deactivate Account')).toBeInTheDocument();
  });

  test('shows deactivation modal on click', () => {
    render(<BrowserRouter><Settings /></BrowserRouter>);
  
    fireEvent.click(screen.getByText('Deactivate Account'));

    expect(screen.getByText('Confirm Deactivation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type 'CONFIRM' to deactivate")).toBeInTheDocument();
  });

  test('deactivates account when user confirms deactivation and accepts terms', async () => {
    api.deactivateAccount.mockResolvedValue({});
    render(<BrowserRouter><Settings /></BrowserRouter>);
  
    fireEvent.click(screen.getByText('Deactivate Account'));

    fireEvent.change(screen.getByPlaceholderText("Type 'CONFIRM' to deactivate"), { target: { value: 'CONFIRM' } });
    fireEvent.click(screen.getByText('I have read and accept the terms of deactivation.'));
    fireEvent.click(screen.getByText('Deactivate'));

    await waitFor(() => {
      expect(api.deactivateAccount).toHaveBeenCalledWith('test_token');
      expect(localStorageMock.clear).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });
});
