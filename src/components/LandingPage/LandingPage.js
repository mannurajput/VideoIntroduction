import React from 'react'
import { useRef, useEffect } from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
const LandingPage = ({userName}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoElement.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Error accessing camera:', error);
                });
        }

        return () => {
            if (videoElement && videoElement.srcObject) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div className=" d-flex justify-content-center align-items-center ">
            <div>
                <h4 className=" w3-wide text-center">Creating Video Introduction for {userName} </h4>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="rounded"
                    style={{
                        width: '887px',
                        height: '462px',
                        border: '1px solid #ccc',
                        backgroundColor: 'black',
                        objectFit: 'cover', // Set object-fit to cover
                    }}
                    width="887"
                    height="462"
                ></video>

                <Link to="/Allquestion">
                    <button className=" start_Button mt-4">Start creating Video Introduction</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;