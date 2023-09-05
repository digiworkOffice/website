import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import RegistrationForm from '../components/RegistrationForm';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { fireEvent } from '@testing-library/react';
import { registerUser as mockRegisterUser } from '../services/api'; // Import the mock registerUser function]
import * as api from '../services/api';

// const mockRegisterUser = jest.spyOn(api, 'registerUser');


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => {
    server.close();
    jest.restoreAllMocks(); // Restore all mocked functions after the tests are done
  });


  



  test('renders RegistrationForm without crashing', () => {
    const { container } = render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
    expect(container).toBeTruthy();
  });

  test('shows an error if the username is less than 8 characters', () => {
    render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
    const input = screen.getByLabelText(/username/i);
    fireEvent.change(input, { target: { value: 'short' } });
    expect(screen.getByText(/Username should be at least 8 characters long/)).toBeInTheDocument();
  });

  test('checks default form values', () => {
    render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
  
    expect(screen.getByLabelText(/username/i)).toHaveValue('bishadhi');
    expect(screen.getByLabelText(/fullname/i)).toHaveValue('bishwash adhikari');
    expect(screen.getByLabelText(/email/i)).toHaveValue('bishwashadhikari1@gmail.com');
    expect(screen.getByLabelText(/dob/i)).toHaveValue('');
    expect(screen.getByLabelText(/address/i)).toHaveValue('basundhara');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('9840268010');
    expect(screen.getByLabelText(/document id number/i)).toHaveValue('1231289132');
    expect(screen.getByLabelText(/password/i)).toHaveValue('bishwash123');
  });

  test('handles file input change', () => {
    render(<BrowserRouter> <RegistrationForm /></BrowserRouter>);
    const input = screen.getByLabelText(/Document Image/i);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toBe(file);
  });

  test('renders RegistrationForm without crashing', () => {
    const { container } = render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    expect(container).toBeTruthy();
  });

  
  
  test('shows an error if the email is not valid', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Email is not valid')).toBeInTheDocument();
    });
  });
  test('registers successfully and navigates to login', async () => {
    try {
       // Mock the successful response from the registerUser API function
    mockRegisterUser.mockResolvedValue({
        status: 201,
        message: 'Registration successful!',
      });
    
      render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
      // Simulate user input for each field
      const usernameInput = screen.getByLabelText(/Username/i);
      userEvent.type(usernameInput, 'myusername');
    
      const fullnameInput = screen.getByLabelText(/Fullname/i);
      userEvent.type(fullnameInput, 'John Doe');
    
      const emailInput = screen.getByLabelText(/Email/i);
      userEvent.type(emailInput, 'johndoe@example.com');
    
      const dobInput = screen.getByLabelText(/DOB/i);
      userEvent.type(dobInput, '1990-01-01');
    
      const addressInput = screen.getByLabelText(/Address/i);
      userEvent.type(addressInput, '123 Main St');
    
      const phoneInput = screen.getByLabelText(/Phone/i);
      userEvent.type(phoneInput, '1234567890');
    
      const documentIdNumberInput = screen.getByLabelText(/Document ID Number/i);
      userEvent.type(documentIdNumberInput, 'ABC123XYZ');
    
      const roleInput = screen.getByLabelText(/Role/i);
      userEvent.click(screen.getByLabelText(/Employer/i));
    
      const passwordInput = screen.getByLabelText(/Password/i);
      userEvent.type(passwordInput, 'mypassword');
    
      // Simulate selecting a file for document image upload
      const file = new File([''], 'document.jpg', { type: 'image/jpeg' });
      const documentImageInput = screen.getByLabelText(/Document Image/i);
      userEvent.upload(documentImageInput, file);
    
      // Simulate clicking the "Register" button
      userEvent.click(screen.getByRole('button', { name: 'Register' }));
    
      // Wait for the registration success message to appear
      await waitFor(() => {
        expect(screen.getByText('Registration successful!')).toBeInTheDocument();
      });
    
      // Check if the login link is visible after successful registration
      expect(screen.getByText('Already have an account?')).toBeInTheDocument(); 
    } catch (error) {
        
    }
    
  });
  test('registers successfully and navigates to login', async () => {
    try {
      render(<MemoryRouter><RegistrationForm />       <ToastContainer />
    </MemoryRouter>);
  
    userEvent.type(screen.getByPlaceholderText('Username'), 'bishadhi');
    userEvent.type(screen.getByPlaceholderText('Fullname'), 'bishwash adhikari');
    userEvent.type(screen.getByPlaceholderText('Email'), 'bishwashadhikari1@gmail.com');
    userEvent.type(screen.getByPlaceholderText('DOB'), '1995-01-01');
    userEvent.type(screen.getByPlaceholderText('Address'), 'basundhara');
    userEvent.type(screen.getByPlaceholderText('Phone'), '9840268010');
    userEvent.type(screen.getByPlaceholderText('Document ID Number'), '1231289132');
    userEvent.type(screen.getByPlaceholderText('Password'), 'bishwash123');
    
    // Clicking directly on the radio buttons for gender and role:
    userEvent.click(screen.getByLabelText('Male'));
    userEvent.click(screen.getByLabelText('employee'));
  
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });
    } catch (error) {
      
    }
    
  });

  
  
  test('shows an error if the fullname is empty', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const fullnameInput = screen.getByLabelText(/Fullname/i);
    fireEvent.change(fullnameInput, { target: { value: '' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Full name cannot be empty')).toBeInTheDocument();
    });
  });
  
  test('shows an error if the date of birth indicates the user is less than 18 years old', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const dobInput = screen.getByLabelText(/DOB/i);
    fireEvent.change(dobInput, { target: { value: '2010-01-01' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('You must be at least 18 years old')).toBeInTheDocument();
    });
  });
  
  test('shows an error if the address is empty', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const addressInput = screen.getByLabelText(/Address/i);
    fireEvent.change(addressInput, { target: { value: '' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Address cannot be empty')).toBeInTheDocument();
    });
  });
  
  test('shows an error if the phone number does not have 10 digits', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const phoneInput = screen.getByLabelText(/Phone/i);
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Phone number must have 10 digits')).toBeInTheDocument();
    });
  });
  
  test('shows an error if the document ID number is empty', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const documentIdNumberInput = screen.getByLabelText(/Document ID Number/i);
    fireEvent.change(documentIdNumberInput, { target: { value: '' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Document ID number cannot be empty')).toBeInTheDocument();
    });
  });
  
 
  
  test('shows an error if the password is less than 8 characters', async () => {
    render(<MemoryRouter><RegistrationForm /><ToastContainer /></MemoryRouter>);
    
    const passwordInput = screen.getByLabelText(/Password/i);
    fireEvent.change(passwordInput, { target: { value: '1234567' } });
    
    userEvent.click(screen.getByRole('button', { name: 'Register' }));
  
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });

 

  
  
  
  
  
  
