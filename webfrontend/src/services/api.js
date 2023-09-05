import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api", // replace with your API base URL
});

export const registerUser = async (userData) => {
  try {
    const response = await instance.post("/users/register", userData);
    return response;
  } catch (error) {
    console.error("Error while registering user", error);
    throw error;
  }
};

export const loginUser = async (userCredentials) => {
  try {
    const response = await instance.post("/users/login", userCredentials);
    return response;
  } catch (error) {
    console.error("Error while logging in user", error);
    throw error;
  }
};

export const loginAdmin = async (adminCredentials) => {
  try {
    const response = await instance.post("/admin/login", adminCredentials);
    return response;
  } catch (error) {
    console.error("Error while logging in admin", error);
    throw error;
  }
};

export const validateToken = async (token) => {
  try {
    const response = await instance.post(
      "/users/loginWithToken",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while validating token", error);
    throw error;
  }
};

export const validateAdminToken = async (token) => {
  try {
    const response = await instance.post(
      "/admin/loginWithToken",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while validating token", error);
    throw error;
  }
};

export const getContractsByRoleAndId = async (role, id) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    console.log(role, id);
    // const response = await instance.get("/contracts/filter", { role, id }, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    
    const response = await instance.get(`/contracts/filter`, {
      params: { role, id }, 
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("HERE", response.data);

    return response.data;
  } catch (error) {
    console.error("Error while getting contracts", error);
    throw error;
  }
};

export const addContract = async (contract) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.post("/contracts/", contract, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error while creating contract", error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await instance.post("/users/employees");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch employees", error);
    throw error;
  }
};

export const getWalletById = async (walletId, token) => {
  console.log(walletId);
  // try {
  const response = await instance.get(`/wallets/${walletId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
  // } catch (error) {
  // console.error("Error while getting wallet by id", error);
  // throw error;
  // }
};

export const updateWalletBalance = async (walletId, balance, token) => {
  try {
    const response = await instance.patch(
      `/wallets/${walletId}`,
      { balance },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating wallet balance", error);
    throw error;
  }
};

export const uploadProfilePic = (file) => {
  const formData = new FormData();

  formData.append("profilePicture", file);

  const token = localStorage.getItem("token");

  return instance.post("/users/uploadImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = (id, userData) => {
  const token = localStorage.getItem("token");

  return instance.put(`/users/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateContract = async (contractId, contractData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.put(
      `/contracts/${contractId}`,
      contractData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating contract", error);
    throw error;
  }
};
export const updateContractAdmin = async (contractId, contractData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.put(
      `/admin/contracts/${contractId}`,
      contractData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating contract", error);
    throw error;
  }
};

export const fetchOneContract = async (id) => {
  const token = localStorage.getItem("token");

  const response = await instance.get(`/contracts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { id },
  });
  return response.data;
};
// export const fetchOneContractAdmin = async (id) => {
//   const token = localStorage.getItem("token");

//   const response = await instance.get(`/admin/contracts/${id}`, {
//     headers: { Authorization: `Bearer ${token}` },
//     params: { id },
//   });
//   return response.data;
// };

export const deactivateAccount = async (token) => {
  console.log(token);
  try {
    const response = await instance.delete("/users/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error while deactivating account", error);
    throw error;
  }
};

export const deleteContract = async (contractId) => {
  const token = localStorage.getItem("token");

  console.log("token:", token);
  console.log("contractId:", contractId);
  try {
    const response = await instance.delete(`/contracts/${contractId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error while deleting contract", error);
    throw error;
  }
};

export const deleteContractAdmin = async (contractId) => {
  const token = localStorage.getItem("token");

  console.log("token:", token);
  console.log("contractId:", contractId);
  try {
    const response = await instance.delete(`/admin/contracts/${contractId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error while deleting contract", error);
    throw error;
  }
};

export const endContract = async (contractId, contractData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.put(
      `/contracts/${contractId}`,
      contractData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while ending contract", error);
    throw error;
  }
};
export const endContractAdmin = async (contractId, contractData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await instance.put(
      `/admin/contracts/${contractId}`,
      contractData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error while ending contract", error);
    throw error;
  }
};
