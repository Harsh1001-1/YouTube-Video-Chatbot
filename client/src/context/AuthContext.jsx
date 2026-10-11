import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");

        if(!storedUser || storedUser === "undefined") {
            return null;
        }

        try {
            return JSON.parse(storedUser)
        }
        catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    const login = (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}