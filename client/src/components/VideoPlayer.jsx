import "../styles/videoRoom.css";

function VideoPlayer({ video }) {
    if (!video) {
        return (
            <div className="video-player">
                No video found
            </div>
        );
    }

    return (
        <div className="video-player">
            <iframe
                id="youtube-player"
                src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                title={video.title || "YouTube video player"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

export default VideoPlayer;