import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import {
    FaComments,
    FaFileAlt,
    FaBookOpen,
    FaYoutube
} from "react-icons/fa";
import "../styles/home.css";

function Home() {
    return (
        <>
            <Navbar />

            <main className="home">
                <section className="hero-section">
                    <div className="hero-badge">
                        <FaYoutube />
                        <span>AI-powered YouTube learning</span>
                    </div>

                    <h1>
                        Turn any YouTube video into an
                        <span> interactive learning experience</span>
                    </h1>

                    <p className="hero-description">
                        Chat with videos, generate instant summaries,
                        create study notes, and understand content faster
                        with the power of AI.
                    </p>

                    <SearchBar />

                    <p className="search-hint">
                        Paste a public YouTube video URL to get started.
                    </p>
                </section>

                <section className="home-features" id="about">
                    <div className="home-feature-card">
                        <div className="home-feature-icon">
                            <FaComments />
                        </div>

                        <h3>Chat with Videos</h3>

                        <p>
                            Ask questions and get answers based directly
                            on the video's content.
                        </p>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-feature-icon">
                            <FaFileAlt />
                        </div>

                        <h3>Instant Summaries</h3>

                        <p>
                            Turn long videos into concise AI-generated
                            summaries in seconds.
                        </p>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-feature-icon">
                            <FaBookOpen />
                        </div>

                        <h3>Smart Study Notes</h3>

                        <p>
                            Generate structured notes that help you review
                            and understand videos faster.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Home;