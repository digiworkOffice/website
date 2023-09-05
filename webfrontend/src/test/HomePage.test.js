import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import HomePage from '../components/HomePage';

import {server} from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => {
    cleanup();
    server.resetHandlers();
  });
  afterAll(() => server.close());

  test('renders HomePage component', async () => {
    render(<Router><HomePage /></Router>);
  
    // Test title
    await screen.findByText(/TALAB : A Payroll Faucet/i);
  
    // Test subtitle
    expect(screen.getByText(/Every second counts. Time is money./i)).toBeInTheDocument();
  
    // Test features
    expect(screen.getByText(/Seamless transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/Contract based payments/i)).toBeInTheDocument();
  
    // Test Roll Now button functionality
    const rollNowButton = screen.getByText(/Roll Now !/i);
    fireEvent.click(rollNowButton);
  
    await waitFor(() => {
      expect(window.location.pathname).toBe('/register');
    });
  
    // Test Join Now button
    const joinNowButton = screen.getByText(/JOIN NOW!/i);
    fireEvent.click(joinNowButton);
  
    await waitFor(() => {
      expect(window.location.pathname).toBe('/register');
    });
  });