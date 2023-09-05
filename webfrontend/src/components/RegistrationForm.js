import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "./widgets/FormInput";
import { checkAvailability, registerUser } from "../services/api";
import { toast } from "react-toastify";
import { useInput } from "./hooks/customHooks";
import RadioButtonGroup from "./widgets/RadioButtonGroup";
import "react-toastify/dist/ReactToastify.css";

const RegistrationForm = () => {
  const navigate = useNavigate();

  // Declare state variables for form inputs
  const [username, setUsername] = useState("bishadhi");
  const [fullname, setFullname] = useState("bishwash adhikari");
  const [gender, setGender] = useState("Other");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("basundhara");
  const [email, setEmail] = useState("bishwashadhikari1@gmail.com");
  const [phone, setPhone] = useState("9840268010");
  const [document_id_number, setDocumentIdNumber] = useState("1231289132");
  const [role, setRole] = useState("employer");
  const [password, setPassword] = useState("bishwash123");
  const [document_image, setFile] = useState();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [dobError, setDobError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [documentIdNumberError, setDocumentIdNumberError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [documentImageError, setDocumentImageError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [availability, setAvailability] = useState({
  //   username: "",
  //   email: "",
  //   phone: "",
  // });

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value.length < 8) {
      setUsernameError("Username should be at least 8 characters long");
    } else {
      setUsernameError("");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(e.target.value)) {
      setEmailError("Email is not valid");
    } else {
      setEmailError("");
    }
  };
  const handleFullnameChange = (e) => {
    setFullname(e.target.value);
    if (e.target.value.length === 0) {
      setFullnameError("Full name cannot be empty");
    } else {
      setFullnameError("");
    }
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
    let today = new Date();
    let birthDate = new Date(e.target.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      setDobError("You must be at least 18 years old");
    } else {
      setDobError("");
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (e.target.value.length === 0) {
      setAddressError("Address cannot be empty");
    } else {
      setAddressError("");
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (e.target.value.length !== 10) {
      setPhoneError("Phone number must have 10 digits");
    } else {
      setPhoneError("");
    }
  };

  const handleDocumentIdNumberChange = (e) => {
    setDocumentIdNumber(e.target.value);
    if (e.target.value.length === 0) {
      setDocumentIdNumberError("Document ID number cannot be empty");
    } else {
      setDocumentIdNumberError("");
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (e.target.value.length === 0) {
      setRoleError("Role must be selected");
    } else {
      setRoleError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files.length === 0) {
      setDocumentImageError("Please upload a document");
    } else {
      setDocumentImageError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [
      fullnameError,
      dobError,
      addressError,
      phoneError,
      documentIdNumberError,
      roleError,
      passwordError,
      documentImageError,
    ];

    if (errors.some((error) => error !== "")) {
      toast.error("Please correct the form errors before submitting");
      return;
    }

    setLoading(true);

    const userData = {
      username,
      fullname,
      gender,
      dob,
      address,
      email,
      phone,
      document_id_number,
      role,
      password,
    };
    console.log('User Data  : ' + userData);

    try {
      const response = await registerUser(userData);
      console.log('Response: ', JSON.stringify(response, null, 2));
      console.log(response["message"]);
      console.log('Status code : ' + response.status)
      if (response.status !== 201) {
        toast.error("Registration failed : " + response.error);
        throw new Error(response.error);
      }
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error while registering user", error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        toast.error(
          `Registration failed: ${
            error.response.data.message || error.response.data.error
          }`
        );
      } else if (error.request) {
        console.log(error.request);
        toast.error("Registration failed: No response from server");
      } else {
        console.error("Error", error.message);
        toast.error(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <FormInput
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              handleUsernameChange(e);
              // checkAvailable("username", e.target.value);
            }}
            placeholder="Username"
            error={usernameError}
          />
          {/* <p>{availability.username}</p> */}

          <FormInput
            id="fullname"
            type="text"
            value={fullname}
            onChange={handleFullnameChange}
            placeholder="Fullname"
            error={fullnameError}
          />

          <FormInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              handleEmailChange(e);
              // checkAvailable("email", e.target.value);
            }}
            placeholder="Email"
            error={emailError}
          />
          {/* <p>{availability.email}</p> */}

          <FormInput
            id="dob"
            type="date"
            value={dob}
            onChange={handleDobChange}
            placeholder="DOB"
            error={dobError}
          />
          <FormInput
            id="address"
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Address"
            error={addressError}
          />
          <FormInput
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              handlePhoneChange(e);
              // checkAvailable("phone", e.target.value);
            }}
            placeholder="Phone"
            error={phoneError}
          />
          {/* <p>{availability.phone}</p> */}
          <FormInput
            id="documentIdNumber"
            type="text"
            value={document_id_number}
            onChange={handleDocumentIdNumberChange}
            placeholder="Document ID Number"
            error={documentIdNumberError}
          />
          <div className="mt-2">
            <label htmlFor="documentImage" className="sr-only">
              Document Image
            </label>
            <input
              id="documentImage"
              name="documentImage"
              type="file"
              onChange={handleFileChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
            {documentImageError && (
              <p className="text-red-500 text-xs mt-1">{documentImageError}</p>
            )}
          </div>
          <RadioButtonGroup
            label="Gender:"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={["Male", "Female", "Other"]}
          />
          <RadioButtonGroup
            label="Role:"
            name="role"
            value={role}
            onChange={handleRoleChange}
            options={["employee", "employer"]}
          />
          <FormInput
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            error={passwordError}
          />
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
          <div className="flex items-center justify-center mt-5">
            <div>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
