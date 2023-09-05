import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Contracts from '../components/Contracts';
import { BrowserRouter as Router } from 'react-router-dom';
import * as api from '../services/api';
import { createMemoryHistory } from 'history'
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mocking the API calls
jest.mock('../services/api', () => ({
  getContractsByRoleAndId: jest.fn(),
  addContract: jest.fn(),
  updateContract: jest.fn(),
  deleteContract: jest.fn(),
  endContract: jest.fn()
}));
const contract = {
  _id: "1",
  employer_wallet: 'employerWallet',
  employee_wallet: 'wallet1',
  collateral: 1000,
  start_from: new Date().toISOString(),
  total_amount: 5000,
  duration: 3600,
  role: 'employer'
};
const server = setupServer(
  rest.get('/contracts', (req, res, ctx) => {
    return res(ctx.json(contract))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Contracts', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ role: 'employer', wallet: 'wallet1' }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test('opens modal and confirms add action', async () => {
    api.getContractsByRoleAndId.mockResolvedValue([]);
    api.addContract.mockResolvedValue();
  
    const { getByText, getByLabelText } = render(<MemoryRouter initialEntries={["/contracts"]}>
    <Contracts />
  </MemoryRouter>);
    
    fireEvent.click(getByText(/Add/i));
    expect(getByText('Are you sure you want to ${action} this contract?')).toBeInTheDocument();
    
    fireEvent.change(getByLabelText('Employer'), { target: { value: 'employer2' } });
    fireEvent.change(getByLabelText('Employee'), { target: { value: 'employee2' } });
  
    fireEvent.click(getByText(/Confirm/i));
    await waitFor(() => expect(api.addContract).toHaveBeenCalled());
  });
      
//   test('displays the contracts correctly', async () => {
//     api.getContractsByRoleAndId.mockResolvedValue([
//       {
//         _id: '1',
//         employer_username: 'employer1',
//         employee_username: 'employee1',
//         created_at: new Date(),
//         start_from: new Date(),
//         status: 'active',
//         paid_up_amount: 100,
//         total_amount: 200,
//       },
//     ]);

//     const { getByText } = render(<MemoryRouter initialEntries={["/contracts"]}>
//     <Contracts />
//   </MemoryRouter>);
//     await waitFor(() => getByText('employer1'));

//     expect(getByText('employer1')).toBeInTheDocument();
//     expect(getByText('employee1')).toBeInTheDocument();
//     expect(getByText('100 / 200')).toBeInTheDocument();
//   });

test('opens modal and confirms delete action', async () => {
  api.getContractsByRoleAndId.mockResolvedValue(contract);
  api.deleteContract.mockResolvedValue();

  const { getByTestId, getByText } = render(<MemoryRouter initialEntries={["/contracts"]}><Contracts /></MemoryRouter>);

  const deleteBtn = getByTestId('delete-icon-1');
  fireEvent.click(deleteBtn);

  // Wait for the modal to open and check if the correct text is displayed
  await waitFor(() => getByText('Are you sure you want to delete this contract?'));
});

//     api.deleteContract.mockResolvedValue();

//     const { getByText, queryByText } = render(<MemoryRouter initialEntries={["/contracts"]}>
//     <Contracts />
//   </MemoryRouter>);

//     await waitFor(() => getByText('employer1'));

//     fireEvent.click(getByText(/Delete/i));
//     expect(getByText('Are you sure you want to delete this contract?')).toBeInTheDocument();

//     fireEvent.click(getByText(/Confirm/i));
//     await waitFor(() => expect(api.deleteContract).toHaveBeenCalled());

//     // Once the contract is deleted, it should no longer be in the document
//     expect(queryByText('employer1')).toBeNull();
//   });

//   test('opens modal and confirms pause action', async () => {
//     api.getContractsByRoleAndId.mockResolvedValue([
//       {
//         _id: '1',
//         employer_username: 'employer1',
//         employee_username: 'employee1',
//         created_at: new Date(),
//         start_from: new Date(),
//         status: 'active',
//         paid_up_amount: 100,
//         total_amount: 200,
//       },
//     ]);

//     api.updateContract.mockResolvedValue();

//     const { getByText } = render(<MemoryRouter initialEntries={["/contracts"]}>
//     <Contracts />
//   </MemoryRouter>);

//     // await waitFor(() => getByText('employer1'));

//     fireEvent.click(getByText(/Pause/i));
//     expect(getByText('Are you sure you want to pause this contract?')).toBeInTheDocument();

//     fireEvent.click(getByText(/Confirm/i));
//     await waitFor(() => expect(api.updateContract).toHaveBeenCalled());
//   });

//   test('opens modal and confirms resume action', async () => {
//     api.getContractsByRoleAndId.mockResolvedValue([
//       {
//         _id: '1',
//         employer_username: 'employer1',
//         employee_username: 'employee1',
//         created_at: new Date(),
//         start_from: new Date(),
//         status: 'paused',
//         paid_up_amount: 100,
//         total_amount: 200,
//       },
//     ]);

//     api.updateContract.mockResolvedValue();

//     const { getByText } = render(<MemoryRouter initialEntries={["/contracts"]}>
//     <Contracts />
//   </MemoryRouter>);

//     // await waitFor(() => getByText('employer1'));

//     fireEvent.click(getByText(/Resume/i));
//     expect(getByText('Are you sure you want to resume this contract?')).toBeInTheDocument();

//     fireEvent.click(getByText(/Confirm/i));
//     await waitFor(() => expect(api.updateContract).toHaveBeenCalled());
//   });

//   test('opens modal and confirms end action', async () => {
//     api.getContractsByRoleAndId.mockResolvedValue([
//       {
//         _id: '1',
//         employer_username: 'employer1',
//         employee_username: 'employee1',
//         created_at: new Date(),
//         start_from: new Date(),
//         status: 'active',
//         paid_up_amount: 100,
//         total_amount: 200,
//       },
//     ]);

//     api.endContract.mockResolvedValue();

//     const { getByText } = render(<MemoryRouter initialEntries={["/contracts"]}>
//     <Contracts />
//   </MemoryRouter>);

//     // await waitFor(() => getByText('employer1'));

//     fireEvent.click(getByText(/End/i));
//     expect(getByText('Are you sure you want to end this contract?')).toBeInTheDocument();

//     fireEvent.click(getByText(/Confirm/i));
//     await waitFor(() => expect(api.endContract).toHaveBeenCalled());
//   });

//   test('confirm edit action', async () => {
//     const history = createMemoryHistory();

//     api.getContractsByRoleAndId.mockResolvedValue([
//       {
//         _id: '1',
//         employer_username: 'employer1',
//         employee_username: 'employee1',
//         created_at: new Date(),
//         start_from: new Date(),
//         status: 'active',
//         paid_up_amount: 100,
//         total_amount: 200,
//       },
//     ]);

//     const { getByTestId } = render(
//       <MemoryRouter initialEntries={["/contracts"]}>
//   <Contracts />
// </MemoryRouter>
//     );

//     await waitFor(() => getByTestId('edit-button-1'));

//     fireEvent.click(getByTestId('edit-button-1'));

//     expect(history.location.pathname).toBe('/edit/1');
//   });
});
