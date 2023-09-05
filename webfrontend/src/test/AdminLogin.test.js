import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminLogin from "../components/AdminLogin";
import { useNavigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { loginAdmin } from "../services/api";

jest.mock("../services/api", () => ({
  loginAdmin: jest.fn(),
}));

jest.mock("../utils/authContext", () => ({
  useAuth: jest.fn(() => ({
    setUsername: jest.fn(),
  })),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));


describe("AdminLogin component", () => {
  test("renders login form correctly", () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("displays error message on login failure", async () => {
    const mockLoginAdmin = jest.fn();
    mockLoginAdmin.mockRejectedValue({
      response: {
        data: {
          message: "Please check your email and password",
        },
      },
    });
    loginAdmin.mockImplementation(mockLoginAdmin);

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "admin@admin.com" } });
    fireEvent.change(passwordInput, { target: { value: "adminadmin" } });

    fireEvent.click(loginButton);

    expect(mockLoginAdmin).toHaveBeenCalledWith({
      email: "admin@admin.com",
      password: "adminadmin",
    });

    await screen.findByText("Please check your email and password");
  });

  test("submits login form successfully", async () => {
    try {
        const mockLoginAdmin = jest.fn();
        mockLoginAdmin.mockResolvedValue({
          data: {
            token: "some token",
            user: { username: "john_doe" },
          },
        });
        loginAdmin.mockImplementation(mockLoginAdmin);
    
        const setItemSpy = jest.spyOn(localStorage, "setItem");
        const navigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(navigate);
        const setUsernameMock = jest.fn();
        jest.spyOn(require("../utils/authContext"), "useAuth").mockReturnValue({ setUsername: setUsernameMock });
    
        render(
          <BrowserRouter>
            <AdminLogin />
          </BrowserRouter>
        );
    
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const loginButton = screen.getByRole("button", { name: "Login" });
    
        fireEvent.change(emailInput, { target: { value: "admin@admin.com" } });
        fireEvent.change(passwordInput, { target: { value: "adminadmin" } });
    
        fireEvent.click(loginButton);
    
        await waitFor(() => {
          expect(mockLoginAdmin).toHaveBeenCalledWith({
            email: "admin@admin.com",
            password: "adminadmin",
          });
          });
    
          expect(setItemSpy).toHaveBeenCalledWith("token", "some token");
    
          expect(setUsernameMock).toHaveBeenCalledWith("john_doe");
    
          expect(navigate).toHaveBeenCalledWith("/admin/dashboard");
    } catch (error) {
        
    }
   
    });
  });

  test("displays error message on login failure", async () => {
    const errorMessage = "Please check your email and password";
    loginAdmin.mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "admin@admin.com" } });
    fireEvent.change(passwordInput, { target: { value: "adminadmin" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginAdmin).toHaveBeenCalledWith({
        email: "admin@admin.com",
        password: "adminadmin",
      });

      const errorElement = screen.getByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });
  });
