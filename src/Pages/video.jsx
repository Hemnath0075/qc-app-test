import React, { useEffect, useRef } from 'react';

const VideoStream = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const loadStream = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/video_feed');
                if (!response.ok) {
                    throw new Error('Failed to fetch video stream');
                }
                const reader = response.body.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    const blob = new Blob([value], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    videoRef.current.src = imageUrl;
                }
            } catch (error) {
                console.error('Error fetching video stream:', error);
            }
        };

        loadStream();

        return () => {
            // Cleanup code here if needed
        };
    }, []);

    return <img ref={videoRef} alt="Live Stream" />;
};

export default VideoStream;