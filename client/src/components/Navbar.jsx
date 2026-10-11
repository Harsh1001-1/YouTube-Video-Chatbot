import "../styles/home.css";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";
import { useState } from "react";
import {
    FaBars,
    FaTimes,
    FaSignOutAlt
} from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link
                to="/"
                className="navbar-logo-link"
                onClick={closeMenu}
            >
                <Logo />
            </Link>

            <button
                className="menu-toggle"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div
                className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}
            >
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? "active-nav-link" : ""
                    }
                >
                    Home
                </NavLink>

                {isAuthenticated && (
                    <NavLink
                        to="/dashboard"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? "active-nav-link" : ""
                        }
                    >
                        Recent Chats
                    </NavLink>
                )}

                <a href="#about" onClick={closeMenu}>
                    About
                </a>

                <button
    className="theme-toggle"
    onClick={toggleTheme}
    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
>
    {theme === "light" ? <FaMoon /> : <FaSun />}
</button>

                {isAuthenticated ? (
                    <>
                        <div className="nav-user">
                            <span className="user-avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>

                            <span className="user-name">
                                {user?.name}
                            </span>
                        </div>

                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            onClick={closeMenu}
                        >
                            Login
                        </NavLink>

                        <Link
                            to="/signup"
                            className="signup-nav-button"
                            onClick={closeMenu}
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;