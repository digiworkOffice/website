import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";
import { useAuth } from "../utils/authContext";
const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("adminadmin");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredentials = { email, password };
      const response = await loginAdmin(userCredentials);
      console.log(response);

      window.localStorage.setItem("token", response.data.token);
      console.log(response.data.user.username);
      auth.setUsername(response.data.user.username);

      // handle the response. For example, save the returned user info and JWT into local storage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // localStorage.setItem('token', response.token);
      setLoading(false);
      navigate("/admin/dashboard"); // redirect the user to the home page
    } catch (error) {
      setError("Please check your email and password");
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Admin Login
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  Please Contact Higher authorities for Help{"   "}
                  <span
                    onClick={() => navigate("/register")}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    User Portal.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
