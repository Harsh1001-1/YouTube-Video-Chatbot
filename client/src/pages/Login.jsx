import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext"
import AuthLayout from "../components/AuthLayout";
import "../styles/auth.css";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    }

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const data = await loginUser(formData);

            login(data.token, data.user);

            toast.success(data.message || "Login successful!");

            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Log in to QueryTube and continue learning from your favourite Youtube videos with AI."
        >
            <div className="auth-card">
                <h2>Login</h2>

                <p className="auth-description">
                    Welcome back! Please enter your account details.
                </p>

                <form action="" className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ashketchum@gmail.com"
                            autoComplete="username"
                        />

                        {errors.email && (
                            <p className="error-message">{errors.email}</p>
                        )}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your Password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide Password" : "Show Password"}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="error-message">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Create Account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default Login;