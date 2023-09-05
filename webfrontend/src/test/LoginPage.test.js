import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../components/LoginPage';
import { BrowserRouter } from 'react-router-dom';

// Mock the LoginForm, Navbar, and Footer components
jest.mock('../components/LoginForm', () => () => <div data-testid="login-form">LoginForm</div>);
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Navbar</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Footer</div>);

describe('LoginPage', () => {
  test('renders Navbar, LoginForm, and Footer', () => {
    render(<BrowserRouter><LoginPage /></BrowserRouter>);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
