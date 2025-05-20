import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser && storedUser !== "null" ? JSON.parse(storedUser) : null;
    });
    

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/";  // Redirect to login without `navigate`
    };
    

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
