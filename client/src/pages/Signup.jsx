import AuthLayout from "../components/AuthLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css"
import { useState } from "react";
import toast from "react-hot-toast";
import { signupUser } from "../api/authApi";

function Signup() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const trimmedName = formData.name.trim();
        //Name
        if (!trimmedName) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z ]+$/.test(trimmedName)) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        //Email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        //Password
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const getPasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) {
            return {
                text: "Weak",
                className: "strength-weak",
            };
        }

        if (score <= 4) {
            return {
                text: "Medium",
                className: "strength-medium",
            };
        }

        return {
            text: "Strong",
            className: "strength-strong"
        };
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const data = await signupUser(formData);

            toast.success(
                data.message || "Account created successfully!"
            );

            navigate("/login")
        } catch (error) {
            console.log(error);

            const message = error.response?.data?.message || "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <AuthLayout
            title="Learn Smarter with AI"
            subtitle="Create your QueryTube account and start chatting with YouTube videos, generating summaries, and creating study notes."
        >
            <div className="auth-card">
                <h2>Create Account</h2>

                <p className="auth-description">
                    Join QueryTube and Unlock AI-powered learning.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>Name</label>
                        <input type="text"
                            name="name"
                            placeholder="Ash Ketchum"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        {errors.name && (
                            <p className="error-message">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input type="email"
                            name="email"
                            placeholder="ashketchum@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                        {errors.email && (
                            <p className="error-message">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="password-input-container">
                            <input type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide Password" : "Show Password"}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {formData.password && (
                            <p className={`password-strength ${passwordStrength.className}`}>
                                Strength: {passwordStrength.text}
                            </p>
                        )}

                        {errors.password && (
                            <p className="error-message">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account" : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

export default Signup;