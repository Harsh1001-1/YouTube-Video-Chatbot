import logo from "../assets/logo.png"
import "../styles/logo.css"

function Logo() {
    return (
        <div className="logo-container">
            <img src={logo} alt="QueryTube Logo" className="logo-image"
            />

            <div className="logo-text">
                <h2>QueryTube</h2>
                <span>Learn Smarter with AI</span>
            </div>
        </div>
    )
}

export default Logo;