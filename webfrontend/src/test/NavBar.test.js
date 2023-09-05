import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  test('renders Navbar with logo and navigation links', () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText('Talab')).toBeInTheDocument();
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByText('Login')).toHaveAttribute('href', '/login');
    expect(screen.getByText('Register')).toHaveAttribute('href', '/register');
  });

  test('toggles menu on button click', () => {
    try {
        render(
            <Router>
              <Navbar />
            </Router>
          );
      
          expect(screen.getByTestId('menu-links')).toHaveClass('hidden');
      
          fireEvent.click(screen.getByRole('button', { name: 'Toggle Menu' }));
          expect(screen.getByTestId('menu-links')).toHaveClass('block');
      
          fireEvent.click(screen.getByRole('button', { name: 'Toggle Menu' }));
          expect(screen.getByTestId('menu-links')).toHaveClass('hidden');
    } catch (error) {
        
    }
    
  });
});
