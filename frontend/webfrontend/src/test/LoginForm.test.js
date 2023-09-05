// src/tests/LoginForm.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import LoginForm from '../components/LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());




  test('shows an error message for failed login', async () => {
    server.use(
      rest.post('http://110.44.119.188:4000/users/login', (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );
  
    render(
        <BrowserRouter> 
          <LoginForm />
        </BrowserRouter>
      );
  
    userEvent.type(screen.getByPlaceholderText('Email'), 'wrong@example.com');
    userEvent.type(screen.getByPlaceholderText('Password'), 'wrongpassword');
    userEvent.click(screen.getByRole('button', { name: 'Login' }));

  
    await waitFor(() => {
      expect(screen.getByText('Please check your email and password')).toBeInTheDocument();
    });
  });

  test('renders login form with correct initial state', () => {
    render(
      <BrowserRouter> 
        <LoginForm />
      </BrowserRouter>
    );
  
    expect(screen.getByPlaceholderText('Email').value).toBe('bishwashadhikari1@gmail.com');
    expect(screen.getByPlaceholderText('Password').value).toBe('bishwash123');
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });


  test('updates email and password inputs correctly', async () => {
    render(
      <BrowserRouter> 
        <LoginForm />
      </BrowserRouter>
    );
  
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
  
    // Manually trigger the onChange event to set the value
    fireEvent.change(emailInput, { target: { value: 'new-email@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'new-password' } });
  
    expect(emailInput.value).toBe('new-email@example.com');
    expect(passwordInput.value).toBe('new-password');
  });
  

  
  
  
  

  
  
  test('shows an error message on login failure', async () => {
    server.use(
      rest.post('http://110.44.119.188:4000/users/login', (req, res, ctx) => {
        return res(ctx.status(401));
      })
    );
  
    render(
      <BrowserRouter> 
        <LoginForm />
      </BrowserRouter>
    );
  
    userEvent.click(screen.getByRole('button', { name: 'Login' }));
  
    await waitFor(() => {
      expect(screen.getByText('Please check your email and password')).toBeInTheDocument();
    });
  });

  
test('navigates to register page when register link is clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
  
    userEvent.click(getByText('Register.'));
    // Check for expected behavior, such as a component that renders upon navigation.
  });
  
  
  
  
  
  
  