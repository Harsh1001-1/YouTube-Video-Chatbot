import "../styles/home.css";
import api from "../api/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaYoutube } from "react-icons/fa";

function SearchBar() {
    const [videoUrl, setVideoUrl] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidYoutubeUrl = (url) => {
        const regex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

        return regex.test(url);
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        setError("");

        if (!videoUrl.trim()) {
            setError("Please enter a YouTube URL.");
            return;
        }

        if (!isValidYoutubeUrl(videoUrl.trim())) {
            setError("Please enter a valid YouTube URL");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/video/validate", {
                url: videoUrl.trim(),
            });

            if (response.data.success) {
                navigate("/video", {
                    state: {
                        videoUrl: videoUrl.trim(),
                        video: response.data.video,
                    },
                });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="search-wrapper" onSubmit={handleSearch}>
            <div className="search-bar">
                <FaYoutube className="search-youtube-icon"></FaYoutube>

                <input type="text" placeholder="Paste Youtube video link..."
                    value={videoUrl}
                    onChange={(e) => {
                        setVideoUrl(e.target.value);
                        setError("");
                    }}
                    aria-label="Youtube video URL"
                />

                <button
                    type="submit"
                    disabled={loading}
                    aria-label="Open video"
                >
                    {loading ? (
                        <span className="search-spinner"></span>
                    ) : (
                        <FaArrowRight />
                    )}
                </button>
            </div>

            {error && (
                <p className="search-error">
                    {error}
                </p>
            )}
        </form>
    );
}

export default SearchBar;