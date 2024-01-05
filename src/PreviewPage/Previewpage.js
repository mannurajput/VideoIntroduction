// PreviewPage.js

import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './Previewpage.css'; // Update the path to the styles.css file
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@chakra-ui/react';
const VideoCard = ({ videoUrl, isSelected, onSelect, setUpdate,selectedVideo ,videoNumber}) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const [isPlaying, setPlaying] = useState(false);
    const videoRef = useRef(null);
    // Inside VideoCard component
    const handlePlayClick = () => {
        setPlaying(!isPlaying);
        if (videoRef.current) {
            if (!isPlaying) {
                videoRef.current.play();
                console.log(`Playing Video Number: ${videoNumber+1}`);
            } else {
                videoRef.current.pause();
            }
        }
    };

    const handlePause = () => {
        setPlaying(false);
    };
    // Inside VideoCard component
    const handleRetakeClick = () => {
        console.log('Retake clicked!');
        setUpdate(true);

        // Increment the currentQuestionNumber to the selected video index + 1 (assuming the index starts from 0)
        const currentQuestionNumber = (selectedVideo + 1).toString();

        // Remove the previous video from localStorage if it exists
        const previousQuestionNumber = localStorage.getItem('currentQuestionNumber');
        if (previousQuestionNumber) {
            localStorage.removeItem(`videoUrl_${previousQuestionNumber}`);
        }

        // Store the current video URL in localStorage
        localStorage.setItem('currentQuestionNumber',videoNumber);

        // Update the currentQuestionNumber in localStorage
        // localStorage.setItem('currentQuestionNumber', currentQuestionNumber);

        navigate("/Allquestion");
    };

    const handleVideoCardClick = () => {
        onSelect();
    };
console.log(selectedVideo)
    return (
        <div
            className={`video-card ${isSelected ? 'selected' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleVideoCardClick}
        >
            {(isPlaying || isHovered) && (
                <div className="play-icon" onClick={handlePlayClick}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </div>
            )}
            <video
                ref={videoRef}
                className="player"
                width="100%"
                height="100%"
                controls={false} // Turn off default controls
                autoPlay={isPlaying}
                onPause={handlePause}
                style={{ objectFit: 'cover' }}
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
            {!isPlaying && (
                <button className="retake-button" onClick={handleRetakeClick}>
                    Retake
                </button>
            )}
        </div>
    );
};

const PreviewPage = ({ update, setUpdate,userName }) => {
    const [videoUrls, setVideoUrls] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
    useEffect(() => {
        const currentQuestionNumber = localStorage.getItem('currentQuestionNumber');
        if (currentQuestionNumber == 12) {
            navigate("/Message")
        }
      
        axios.get('https://mynextfilm.ai/viewerlounge/GetAllSingleVideos', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => {
                const fetchedVideoUrls = response.data.map(video => `https://mynextfilm.ai${video.video}`);
                setVideoUrls(fetchedVideoUrls);
            })
            .catch(error => {
                console.error('Error fetching video URLs:', error);
            });
    }, []);
    /* image 44 */


    const handleStartMerge = async () => {
        try {
            // Make a GET request to your API endpoint with the access token
            const response = await axios.get('https://mynextfilm.ai/viewerlounge/ProceedToMerging', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Handle the response as needed
            console.log('API Response:', response.data);
           localStorage.setItem("currentQuestionNumber",12)
            // If the API call is successful, navigate to "/Message"
            navigate('/Message');
        } catch (error) {
            // Handle errors here
            console.error('Error:', error);
        }
    };

    const videoCards = videoUrls.map((videoUrl, index) => (
        <VideoCard
            key={index}
            videoUrl={videoUrl}
            isSelected={selectedVideo === index}
            onSelect={() => setSelectedVideo(index)}
            setUpdate={setUpdate}
            selectedVideo={selectedVideo}  // Pass the selectedVideo prop
          videoNumber={index + 1}
        />
    ));
    console.log(videoUrls)

    return (
        <div className="preview-container">
            {videoUrls.length <1 ?
                (
                    <CircularProgress
                        isIndeterminate
                        color='cyan.300'
                        style={{ alignSelf: 'center', margin: 'auto', marginLeft: "600px", marginTop: "100px"}}
                    />
                ) : 
                (<><h3 className="preview-heading">Previewing Video Introduction of {userName}</h3>
            <div className="preview-cards-container">
                <div className="preview-cards-row">{videoCards.slice(0, 5)}</div>
                <div className="preview-cards-row">{videoCards.slice(5)}</div>
            </div>
                <button className='mt-5 preview' onClick={handleStartMerge} style={{ float: "right", width: '238px', height: '34px',borderRadius:"8px" }}>Create My Video Introduction</button>
                <div>
                   
                </div></>)
            }
        </div>
    );
};

export default PreviewPage;
