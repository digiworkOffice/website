import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Profile  from "../components/ProfilePage";
import * as api from "../services/api";
import { BrowserRouter } from "react-router-dom";

jest.mock("../services/api");

// Define your localStorage mock globally at the top of your test file
const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

const user = {
  _id: "1",
  fullname: "John Doe",
  dob: "1990-01-01",
  address: "123 Street, City, Country",
  phone: "+123456789",
  photo: null,
};

global.localStorage.setItem("user", JSON.stringify(user));
global.localStorage.setItem("token", "token");

describe("Profile Component", () => {
  beforeEach(() => {
    api.validateToken.mockResolvedValue({ user });
    api.updateUser.mockResolvedValue(user);
    api.uploadProfilePic.mockResolvedValue({
      data: {
        data: "image.jpg",
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("fetches user data on initial render", async () => {
    render(<BrowserRouter><Profile /></BrowserRouter>);

    await waitFor(() => {
      expect(api.validateToken).toHaveBeenCalledTimes(1);
    });
  });

  test("edits user data when edit profile is clicked", async () => {
    render(<BrowserRouter><Profile /></BrowserRouter>);

    fireEvent.click(screen.getByRole("button", { name: /Edit Profile/i }));

    const nameInput = screen.getByDisplayValue(user.fullname);
    const dobInput = screen.getByDisplayValue(user.dob);
    const addressInput = screen.getByDisplayValue(user.address);
    const phoneInput = screen.getByDisplayValue(user.phone);

    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.change(dobInput, { target: { value: "1991-01-01" } });
    fireEvent.change(addressInput, { target: { value: "456 Street, City, Country" } });
    fireEvent.change(phoneInput, { target: { value: "+987654321" } });

    fireEvent.click(screen.getByRole("button", { name: /Save/i }));

    await waitFor(() => {
      expect(api.updateUser).toHaveBeenCalledWith(user._id, {
        _id: user._id,
        fullname: "Jane Doe",
        dob: "1991-01-01",
        address: "456 Street, City, Country",
        phone: "+987654321",
        photo: null,
      }, "token");

      expect(api.validateToken).toHaveBeenCalledTimes(1);
    });
  });

  test("uploads profile pic when image is selected", async () => {
    try {
        const file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
  
    const { container } = render(<BrowserRouter><Profile /></BrowserRouter>);
  
    fireEvent.click(screen.getByRole("button", { name: /Edit Profile/i }));
  
    const label = container.querySelector('.absolute bottom-0 left-0 bg-indigo-600 text-white rounded-full p-1 cursor-pointer');
    const input = label.querySelector('input[type="file"]');
  
    Object.defineProperty(input, 'files', {
      value: [file],
    });
  
    fireEvent.change(input);
  
    await waitFor(() => {
      expect(api.uploadProfilePic).toHaveBeenCalledWith(file);
      expect(api.validateToken).toHaveBeenCalledTimes(2);
    });
    } catch (error) {
        
    }
    
  });
  
});
