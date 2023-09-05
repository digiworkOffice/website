import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext(null)

export const AdminAuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null)


    return (
        <AdminAuthContext.Provider value={{ username, setUsername }}>
            {children}
        </AdminAuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AdminAuthContext)
}