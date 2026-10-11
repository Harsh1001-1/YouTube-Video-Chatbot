import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/dashboard.css";

function Dashboard() {
    const { user } = useAuth();
    const [recentChats, setRecentChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const openConversation = async (chat) => {
        try {
            const videoUrl = `https://www.youtube.com/watch?v=${chat.videoId}`;

            const response = await api.post("/video/validate", {
                url: videoUrl,
            });

            if (!response.data.success) {
                return;
            }

            navigate("/video", {
                state: {
                    videoUrl,
                    video: response.data.video,
                },
            });
        } catch (error) {
            console.error("Failed to open conversation:", error);
        }
    };

    useEffect(() => {
        const fetchRecentChats = async () => {
            try {
                setLoading(true);

                const response = await api.get(
                    "/dashboard/recent-chats"
                );

                if (response.data.success) {
                    setRecentChats(response.data.chats);
                }
            } catch (error) {
                console.error("Failer to fetch recent chats:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecentChats();
    }, []);

    return (
        <>
            <Navbar />
            <main className="dashboard">
                <section className="dashboard-header">
                    <div>
                        <p className="dashboard-label">Your Dashboard</p>
                        <h1>Welcome Back, {user?.name}</h1>

                        <p>Continue Learning from Youtube with AI-powered conversations, summaries, and notes.</p>
                    </div>

                    <Link to="/" className="dashboard-action">Explore Videos</Link>
                </section>

                <section className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <h2>Recent Videos</h2>
                            <p>
                                Continue learning from videos you've recently explored.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="dashboard-empty">
                            <p>Loading recent videos...</p>
                        </div>
                    ) : recentChats.length === 0 ? (
                        <div className="dashboard-empty">
                            <h3>No recent videos yet</h3>

                            <p>Start exploring a YouTube video and it will appear here.</p>

                            <Link to="/">Explore a Video</Link>
                        </div>
                    ) : (
                        <div className="recent-videos-grid">
                            {recentChats.map((chat) => (
                                <div
                                    key={chat._id}
                                    className="recent-video-card"
                                    onClick={() => openConversation(chat)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <img
                                        src={`https://img.youtube.com/vi/${chat.videoId}/mqdefault.jpg`}
                                        alt="YouTube video thumbnail"
                                    />

                                    <div className="recent-video-content">
                                        <h3>YouTube Video</h3>

                                        <p>
                                            {chat.messages.length} chat messages
                                        </p>

                                        <span>
                                            Last opened{" "}
                                            {new Date(chat.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <h2>Recent Conversations</h2>
                            <p>Quickly return to your previous AI conversations.</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="dashboard-empty">
                            <p>Loading conversations...</p>
                        </div>
                    ) : recentChats.length === 0 ? (
                        <div className="dashboard-empty">
                            <h3>No conversations yet</h3>
                            <p>
                                Your conversations with YouTube videos will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="conversation-list">
                            {recentChats.map((chat) => (
                                <div
                                    className="conversation-card"
                                    key={chat._id}
                                    onClick={() => openConversation(chat)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div>
                                        <h3>
                                            YouTube Video
                                        </h3>

                                        <p className="conversation-video-id">
                                            Video ID: {chat.videoId}
                                        </p>

                                        <p>
                                            {chat.messages.length} messages
                                        </p>
                                    </div>

                                    <span className="conversation-date">
                                        {new Date(
                                            chat.updatedAt
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default Dashboard