import Logo from "./Logo";
import "../styles/auth.css"
import {
    FaRobot,
    FaYoutube,
    FaBookOpen,
    FaComments,
    FaHistory,
} from "react-icons/fa";

function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="auth-page">
            <div className="auth-left">
                <Logo></Logo>

                <h1>{title}</h1>
                <p>{subtitle}</p>

                <div className="feature-list">

                    <div className="feature-item">
                        <FaComments className="feature-icon" />
                        <span>Chat with any YouTube video</span>
                    </div>

                    <div className="feature-item">
                        <FaRobot className="feature-icon" />
                        <span>AI-powered summaries</span>
                    </div>

                    <div className="feature-item">
                        <FaBookOpen className="feature-icon" />
                        <span>Generate smart study notes</span>
                    </div>

                    <div className="feature-item">
                        <FaYoutube className="feature-icon" />
                        <span>Interactive transcript navigation</span>
                    </div>

                    <div className="feature-item">
                        <FaHistory className="feature-icon" />
                        <span>Secure chat history</span>
                    </div>

                </div>
            </div>

            <div className="auth-right">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout;