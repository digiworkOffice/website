import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminDashboard from '../components/AdminDashboard';

jest.mock('axios');
jest.mock('react-toastify');

describe('AdminDashboard', () => {
  let history;
  beforeEach(() => {
    history = createMemoryHistory();
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.get.mockResolvedValueOnce({ data: { totalTransactionAmount: 0 } });
    localStorage.setItem('token', 'test_token');
  });

  afterEach(() => {
    axios.get.mockReset();
    localStorage.clear();
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
      <AdminDashboard />
    </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  it('calls the initial hooks correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
      <AdminDashboard />
    </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(6);
    });
  });

  it('logs out correctly', async () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
      <AdminDashboard />
    </MemoryRouter>
    );

    fireEvent.click(getByText('Logout'));

    expect(localStorage.getItem('token')).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Logged Out successfully!');
    expect(history.location.pathname).toBe('/');
  });
});
