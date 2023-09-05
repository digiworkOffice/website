import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../components/RegisterPage';

// Mock the RegistrationForm, Navbar, and Footer components
jest.mock('../components/RegistrationForm', () => () => <div data-testid="registration-form">RegistrationForm</div>);
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('RegisterPage', () => {
  test('renders Navbar, RegistrationForm, and Footer', () => {
    render(<RegisterPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
