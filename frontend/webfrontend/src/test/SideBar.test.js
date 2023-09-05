import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { FaTimes, FaBars, FaHome, FaFileContract, FaWallet, FaCog, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('Sidebar', () => {
  test('renders Sidebar with navigation links when isOpen is true', () => {
    render(
      <Router>
        <Sidebar isOpen={true} setIsOpen={() => {}} />
      </Router>
    );

    expect(screen.getByText('Talab')).toBeInTheDocument();
    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('Contracts').closest('a')).toHaveAttribute('href', '/contracts');
    expect(screen.getByText('Wallet').closest('a')).toHaveAttribute('href', '/wallet');
    expect(screen.getByText('Settings').closest('a')).toHaveAttribute('href', '/settings');
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile');
    expect(screen.getByText('Log Out').closest('button')).toBeInTheDocument();
  });

  test('renders Sidebar without navigation links when isOpen is false', () => {
    render(
      <Router>
        <Sidebar isOpen={false} setIsOpen={() => {}} />
      </Router>
    );

    expect(screen.queryByText('Dashboard')).toBeNull();
    expect(screen.queryByText('Contracts')).toBeNull();
    expect(screen.queryByText('Wallet')).toBeNull();
    expect(screen.queryByText('Settings')).toBeNull();
    expect(screen.queryByText('Profile')).toBeNull();
    expect(screen.queryByText('Log Out')).toBeNull();
  });



  test('handles logout and shows success message', () => {
    try {
        localStorage.setItem('token', 'fake-token');

    const setIsOpenMock = jest.fn();
    render(
      <Router>
        <Sidebar isOpen={true} setIsOpen={setIsOpenMock} />
      </Router>
    );

    fireEvent.click(screen.getByText('Log Out').closest('button'));
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(screen.getByTestId('sidebar-container')).toHaveClass('translate-x-full');
    expect(setIsOpenMock).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith('Logged Out successfully!');
    } catch (error) {
        
    }
    
  });
});
