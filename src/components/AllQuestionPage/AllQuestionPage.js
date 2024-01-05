import React from 'react';
import './AllQuestionPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoIntroduction } from '../../stores/Userslice';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';
import { allQuestions } from './QuestionsData';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import PauseIcon from '@mui/icons-material/Pause';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ProgressBarGroup from './SquareProgressBar';
const AllQuestionPage = ({ update, setUpdate }) => {
    let videoRef = useRef(null);
    let recordedVideoRef = useRef(null); // Reference to the second video
    let mediaRecorderRef = useRef(null);
    let chunksRef = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaybackEnabled, setIsPlaybackEnabled] = useState(false);
    const [isPlayback, setIsPlayback] = useState(false);
    const [currentQuestionNumber, setcurrentQuestionNumber] = useState(
        parseInt(localStorage.getItem("currentQuestionNumber")) || 1);
    const [userName, setuserName] = useState("");
    const [isEnable, setIsEnable] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [isDisableUpload, setIsDisableUpload] = useState(false);
    const [isRecordingActive, setIsRecordingActive] = useState(false);
    const [isFilling, setIsFilling] = useState(false);
    const [isRefeal, setIsRefeal] = useState(false);
    const [isFetch, setIsFetch] = useState(false);
    const [isHideImage, setIsHideImage] = useState(true);
    const [isPlay, setIsPlay] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedTime, setSelectedTime] = useState(0.5); // Default value
    const [selectedFile, setSelectedFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(true);
    const [isHideRecord, setIsHideRecord] = useState(false);
    const [isCount, setIsCount] = useState(false);
    const [isRecordingOn, setIsRecordingOn] = useState(true);
    const [countdown, setCountdown] = useState();
    const [isShowImage, setIsShowImge] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const countdownIntervalRef = useRef(null);
    const [isUpload, setIsUpload] = useState(false);
    const [hidePlay, setHidePlay] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('accessToken');
    const { data, loading } = useSelector((state) => state.videoIntroduction);
    const [isPaused, setIsPaused] = useState(false);
    // Access the current question based on the currentQuestionNumber:
    const currentQuestion = allQuestions[currentQuestionNumber];
    const fileInputRef = useRef(null);
    const [imageStartDuration, setImageStartDuration] = useState(null);
    const [imageEndDuration, setImageEndDuration] = useState(null);
    // Generate a UUID
    const uuid = uuidv4();

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
    const handleChange = (event) => {
        // Assuming event.target.value is a string representing the selected time
        const selectedTimeAsString = event.target.value;

        // Use parseInt to convert the string to a number
        const selectedTimeAsNumber = parseInt(selectedTimeAsString, 10);

        // Now you can use selectedTimeAsNumber as a number
        setSelectedTime(selectedTimeAsNumber);
    };


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setError(false);
        setIsShowImge(true);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];

        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setError(false);
        } else {
            setError(true);
        }
    };

    const handleClickImage = () => {
        // Trigger the click event on the file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const containerStyle = {
        backgroundImage: selectedFile ? `url(${URL.createObjectURL(selectedFile)})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    //upload image and time
    const handleUpload = () => {
        setImageEndDuration(imageStartDuration + selectedTime)
        setIsShowImge(true)
        if (!selectedFile) {
            // setError(true);
        } else {
            setShowPopup(false);
            // setIsPlaybackEnabled(true);
            setIsEnable(false);
            // setIsDisable(true);
            setIsUpload(false);
        }
        setIsDisableUpload(true)
        setIsHideImage(false);

    };

    useEffect(() => {
        setIsCount(true)
        dispatch(fetchVideoIntroduction(accessToken));
    }, [accessToken, showPopup, isDisable, isPlaybackEnabled]);

    useEffect(() => {
        localStorage.setItem("currentQuestionNumber", currentQuestionNumber);
        if (data) {
            setuserName(data.username);
        }
    }, [currentQuestionNumber, data]);




    let pauseTime = 0; // Variable
    let timeoutValue;
    // Function to handle time value based on currentQuestionNumber
    const timeValue = () => {
        switch (currentQuestionNumber) {
            case 1:
            case 2:
            case 3:
            case 5:
            case 6:
            case 7:
                timeoutValue = 5000;
                break;
            case 4:
            case 8:
            case 9:
                timeoutValue = 10000;
                break;
            case 10:
                timeoutValue = 15000;
                break;
            default:
                timeoutValue = 5000; // Handle other cases or set a default value
        }
    };
    //function for handle start recording

    const startRecording = () => {
        setIsFilling(true);
        setIsRecording(true);
        setIsPaused(false);
        setIsEnable(false);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;

                mediaRecorderRef.current = new MediaRecorder(stream);
                const chunks = [];

                mediaRecorderRef.current.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/mp4' });
                    const url = URL.createObjectURL(blob);
                    videoRef.current.src = url;
                    setIsDisable(true)
                    setVideoUrl(videoRef.current.src);
                };
                if (isRecordingOn) {
                    timeValue(); // Assuming this function is defined and sets some value
                    setCountdown(timeoutValue / 1000); // Initialize the countdown value
                    startCountdown(timeoutValue); // Assuming this function is defined
                }

                setIsRecordingOn(false);
                mediaRecorderRef.current.start();
                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });
    };
  
    // Use useEffect to clear the interval when the component unmounts
    useEffect(() => {
        if (currentQuestionNumber >= 11) {
            navigate("/PreviewPage")
        }
        timeValue();
        setCountdown(timeoutValue / 1000);
        return () => {
            clearInterval(countdownIntervalRef.current);
        };
      
    }, []);



    // Function to pause recording
    const pauseRecording = () => {
        clearInterval(countdownIntervalRef.current);
        setIsPlaybackEnabled(false);
        setIsPaused(true);
        setIsRecording(false);
        setIsDisable(true)

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            // Ensure timeoutValue is set before calculating pauseTime
            timeValue();
            // Calculate pauseTime by subtracting the remaining time from the original timeoutValue
            pauseTime = countdown;
            setImageStartDuration(timeoutValue/1000 - pauseTime)

            
        }
    };
    //handling the function for stoprecording
    const stopRecording = () => {
        setIsFilling(false);
        setIsRefeal(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
    };
    // function for the resume recording
    const resumeRecording = () => {
        pauseTime = countdown;
        setCountdown(pauseTime); // Initialize the countdown value
        startCountdown(countdown); // Adjust countdown based on pause time
        setIsPlaybackEnabled(false);
        setIsDisable(true)
        setIsPaused(false);
        setIsDisable(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
         
        }
    };

    // Function to start the countdown timer
    const startCountdown = (timeoutValue) => {
        clearInterval(countdownIntervalRef.current);
        if (isCount) {
            countdownIntervalRef.current = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown < 1) {
                        clearInterval(countdownIntervalRef.current);
                        stopRecording();
                        setIsEnable(true);
                        setIsHideRecord(true)
                        setIsHideImage(false);
                        setIsDisable(true)
                        setIsPlaybackEnabled(true);
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000); // Update every second
        }
    };

    const handlePlayPauseClick = () => {
        if (isPlaying) {
            // Pause the recorded video
            recordedVideoRef.current && recordedVideoRef.current.pause();
            setIsDisableUpload(false);
            setIsPlayback(false);
            if (countdown !== 0) {
                 setIsEnable(false);
            }
           
        } else {
            setIsPlayback(true);
            setIsDisableUpload(true);
            setHidePlay(true);   
            setIsEnable(true);
            if (videoUrl) {
                // Remove any existing 'ended' event listener
                recordedVideoRef.current.removeEventListener('ended', handleVideoEnd);
                // Set the source for the recorded video
                recordedVideoRef.current.src = videoUrl;
                // Play the recorded video
                recordedVideoRef.current.play();
                // Listen for the 'ended' event to detect when the video playback completes
                recordedVideoRef.current.addEventListener('ended', handleVideoEnd);
            }
        }

        // Toggle the play/pause state
        setIsPlaying(!isPlaying);
    };

    // Cleanup function to remove the 'ended' event listener
    const handleVideoEnd = () => {
        setIsDisableUpload(false);
        setIsPlayback(false);
        setIsPlay(false);
        setIsPlaying(false);
        if (countdown !== 0) {
            setIsEnable(false); 
        }
        recordedVideoRef.current.removeEventListener('ended', handleVideoEnd);
    };

    //function for uploading the image
    const handleUploadImage = () => {
        setShowPopup(true);
        setIsPlaybackEnabled(true);
        setIsEnable(true);
        setIsDisable(false);
    }
    //function for handling retake
    const handleRetakeClick = () => {
        timeValue(); // Assuming this function is defined and sets some value
        setCountdown(timeoutValue / 1000); // Initialize the countdown value
        startCountdown(timeoutValue); // Assuming this function is defined
        setSelectedFile(null);
        setIsHideImage(true);
        setIsDisableUpload(false);
        setHidePlay(false);
        setIsRefeal(true);
        setIsEnable(false);
        setIsShowImge(false);
        setIsPlaybackEnabled(false);
        startRecording();
        setIsDisable(false);
        setIsPlay(true);
   
    };

    const handleNextClick = async () => {
        timeValue();
        setSelectedFile(null);
        setCountdown(timeoutValue / 1000);
        const formData = new FormData();
        setIsDisableUpload(false)
        setIsHideImage(true);
        setIsShowImge(false)
        const capturedVideoBlob = new Blob(chunksRef.current, { type: "video/mp4" });
        if (currentQuestionNumber < 10) {
            if (currentQuestionNumber < Object.keys(allQuestions[0]).length) {
                setcurrentQuestionNumber(currentQuestionNumber + 1);
            }
            chunksRef.current = [];
            setVideoUrl(null)
            setIsPlaybackEnabled(false);
            setIsEnable(false);
            setIsRecording(false);
            setIsPaused(false);
            setIsDisable(false);
            setIsUpload(false);
            setIsPlay(true);
            setIsRecordingOn(true);
            setIsHideRecord(false);
            setHidePlay(false);
        } else {
            navigate('/Previewpage');
        }
        if (!selectedFile) {
            // Append the video file with the UUID in the filename
            formData.append("videoFile", capturedVideoBlob, `webm_${uuid}.mp4`);
            formData.append("questionNumber", currentQuestionNumber.toString());

            try {
                const response = await axios.post(
                    'https://mynextfilm.ai/viewerlounge/uploadVideo/',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.status === 200) {
                    console.log('Video uploaded successfully!');
                } else {
                    console.log('Video upload failed. Please try again later.');
                }
            } catch (error) {
                console.error('Error posting video:', error);
                console.log('An error occurred while uploading the video.');
            }
        } else {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('duration', selectedTime); // Add the duration variable
            formData.append('start_time', imageStartDuration); // Add the start_time variable
            formData.append('questionNumber', currentQuestionNumber.toString());
            formData.append("video", capturedVideoBlob, `webm_${uuid}.mp4`);
            try {
                const response = await axios.post(
                    'https://mynextfilm.ai/viewerlounge/image_introduction',
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (response.status === 200) {
                    console.log('Image uploaded successfully!');
                } else {
                    console.log('Image upload failed. Please try again later.');
                }
            } catch (error) {
                console.error('Error posting image:', error);
                console.log('An error occurred while uploading the image.');
            }
        }
    
        // Continue with the rest of your code for the 10th question or redirect if needed
    };


    //handling all record  button events
    const handleClick = () => {
        setIsUpload(false)
        if (isPaused) {
                resumeRecording();
                setIsFilling(true);
            setShowPopup(false);
            // setIsRefeal(true)

            }
        if (isRecording) {
                setIsUpload(true);
                setIsRecording(true);
                setIsPaused(false);
                setIsEnable(false)
                pauseRecording();
            setIsFilling(false);
            setIsRefeal(false)
                setIsRecordingActive(true);
                setIsHideRecord(true)
                setIsPlaybackEnabled(true);
        } else {
      startRecording();
        }
    };
    const handleAllNextClick = async () => {
        const formData = new FormData();
        const capturedVideoBlob = new Blob(chunksRef.current, { type: "video/mp4" });
        if (update) {
            navigate("/PreviewPage");
            if (!selectedFile) {
                // Append the video file with the UUID in the filename
                formData.append("videoFile", capturedVideoBlob, `mp4_${uuid}.mp4`);
                formData.append("questionNumber", currentQuestionNumber.toString());
                try {
                    const response = await axios.post(
                       'https://mynextfilm.ai/viewerlounge/uploadVideo/',
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (response.status === 200) {
                        console.log('Video uploaded successfully!');
                    } else {
                        console.log('Video upload failed. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error posting video:', error);
                    console.log('An error occurred while uploading the video.');
                }
            } else {
                const imageFormData = new FormData();
                imageFormData.append('image', selectedFile);
                imageFormData.append('duration', selectedTime);
                imageFormData.append('start_time', imageStartDuration);
                imageFormData.append('questionNumber', currentQuestionNumber.toString());
                imageFormData.append("video", capturedVideoBlob, `webm_${uuid}.mp4`);

                try {
                    const response = await axios.post(
                        'https://mynextfilm.ai/viewerlounge/image_introduction',
                        imageFormData,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (response.status === 200) {
                        console.log('Image uploaded successfully!');
                    } else {
                        console.log('Image upload failed. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error posting image:', error);
                    console.log('An error occurred while uploading the image.');
                }
            }
        } else if (currentQuestionNumber < 10) {
            // Handle the Next button logic
            handleNextClick();
        } else {
            if (!selectedFile) {
               // Append the video file with the UUID in the filename
                formData.append("videoFile", capturedVideoBlob, `webm_${uuid}.mp4`);
                formData.append("questionNumber", currentQuestionNumber.toString())
                try {
                    const response = await axios.post(
                        'https://mynextfilm.ai/viewerlounge/uploadVideo/',
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (response.status === 200) {
                        console.log('Video uploaded successfully!');
                    } else {
                        console.log('Video upload failed. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error posting video:', error);
                    console.log('An error occurred while uploading the video.');
                }
            } else {
                const formData = new FormData();
                formData.append('image', selectedFile);
                formData.append('duration', selectedTime); // Add the duration variable
                formData.append('start_time', imageStartDuration); // Add the start_time variable
                formData.append('questionNumber', currentQuestionNumber.toString());
                formData.append("video", capturedVideoBlob, `webm_${uuid}.mp4`);
                try {
                    const response = await axios.post(
                        'https://mynextfilm.ai/viewerlounge/image_introduction',
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (response.status === 200) {
                        console.log('Image uploaded successfully!');
                    } else {
                        console.log('Image upload failed. Please try again later.');
                    }
                } catch (error) {
                    console.error('Error posting image:', error);
              console.log('An error occurred while uploading the image.');
                }
            }
            navigate("/PreviewPage");
            localStorage.setItem("currentQuestionNumber", 11)
        }
    };

    return (
        <>
            <div className="video-intro-container">
                <div className="video-intro-content">
                    <h1 className="video-intro-heading">
                        Create Video Introduction of {userName}
                    </h1>   <div className=" Image_with-timer">
                <div>
                  
                    {isShowImage&& (
                             <div className='uploaded_image'>
                                    <img className='notranslate'
                                        translate="no" src={URL.createObjectURL(selectedFile)}></img>  
                                    <span className='notranslate'
                                        translate="no">{imageStartDuration} to {imageEndDuration} sec</span>   
                        </div>   
                                )}

                </div>
                    <div className="left-bar-camera-container">
                        <div className="left-bar">     <ProgressBarGroup
                            currentQuestionNumber={currentQuestionNumber}
                            isFilling={isFilling}
                            isRefeal={isRefeal}
                        /></div>     {/* <div className="blur-overlay"></div> */}
                            <div className="camera-container">
                                {
                                    !hidePlay&&<div className="question">{allQuestions[0][currentQuestionNumber]}</div>
                                }
                            
                            {!hidePlay&&<div className="camera-window">
                                    <Webcam
                                        audio={false}
                                        ref={videoRef}
                                        mirrored={true}
                                        className="video-container"
                                        style={{ width: '887', height: '462' }}
                                    />
                              </div>
                            }
                            <div className="camera-window" style={{ display: !hidePlay && "none" }}>
                                    {/* <div className="blur-overlay"></div> */}
                                    <video
                                        ref={recordedVideoRef}
                                        autoPlay
                                        playsInline
                                        className="video-container"
                                        width="887"
                                        height="462"
                                    ></video></div>
                            {!isEnable && <div className="play-pause-btn">
                                <button
                                    className='recording-button'
                                    onClick={handleClick}
                                    disabled={isEnable}

                                >
                                    {isRecording && !isPaused ? (
                                        <PauseCircleFilledIcon style={{ fontSize: '90px', color: '#33b0ca', position: 'absolute', top: "-24px", left: "-21px", height: "90px" }} />
                                    ) : isPaused ? (
                                        <NotStartedIcon style={{ fontSize: '90px', color: '#33b0ca', position: 'absolute', top: "-24px", left: "-21px", height: "90px " }} />
                                    ) : (
                                        <StopCircleIcon style={{ fontSize: '90px', color: "#33b0ca", position: 'absolute', top: "-24px", left: "-21px", height: "90px" }} />
                                    )}
                                </button>
                                {!isRecording && !isPaused ? (
                                    <h5 style={{ color: "#252525", position: "absolute", left: "50%", top: "44px", transform: "translateX(-50%)" }}>
                                        Start Recording
                                    </h5>
                                ) : isPaused ? (
                                    <h5 style={{ color: "#252525", position: "absolute", left: "50%", top: "44px", transform: "translateX(-50%)" }}>
                                        Resume Recording
                                    </h5>
                                ) : (
                                    <h5 style={{ position: "absolute", left: "50%", top: "44px", transform: "translateX(-50%)" }}>
                                        Pause Recording
                                    </h5>
                                )}
                                <p style={{ position: "absolute", left: "50%", top: "74px", transform: "translateX(-50%)" }}> {
                                    !isEnable && <div>

                                            <span className=" notranslate"
                        translate="no"><TimerOutlinedIcon style={{ fontSize: "24px", marginBottom: "6px" }} /> {countdown}  sec</span>
                                    </div>
                                }</p>
                            </div>}
                        </div>
                    </div>
                    {
                        isDisable &&
                        <div className="bottom-btns-container">
                                    <div>
                                        {
                                            isHideImage&& <button className="upload-img-btn"
                                    onClick={handleUploadImage}
                                    disabled={isDisableUpload}><CloudUploadOutlinedIcon />Upload Image</button>
                                        }
                                        
                                         <button className="play-btn" onClick={handlePlayPauseClick} disabled={!isPlaybackEnabled}>
                                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />} {isPlaying ? 'Stop' : 'Play'}
                                </button>
                            
                               
                                <button className="retake-btn" onClick={handleRetakeClick}
                                    disabled={isPlayback}>Retake</button>
                            </div>

                            <div>
                                <button className="next-btn" onClick={handleAllNextClick}
                                    disabled={isPlayback}>{update ? 'Finish' : currentQuestionNumber < 10 ? 'Next' : 'Preview'}
                                    <ArrowForwardIcon style={{ marginLeft: "5px" }} /></button>
                            </div>
                        </div>
                    }
                  
                </div>
            </div>
         
            </div>
            
            <div>
                <input type="file" id="videoInput" style={{ display: 'none' }} />
                <p className="text-center"></p>
            </div>

            <div className="text-center">
                <span id="errorMsg1"></span>
            </div>


            {showPopup && (
                <div className="popupzz">
                    <div className="popup-contenttt">
                        <div className="checkbox-containerr">
                            <div
                                className={error ? "drag-and-drop-container" : 'drag-and-drop-container'}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={handleClickImage}
                                style={containerStyle}
                            >
                                <input
                                    type='file'
                                    className='mx-5'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }} // Hide the file input visually
                                />

                                {!selectedFile && (
                                    <>
                                        <CloudUploadOutlinedIcon
                                            style={{
                                                fontSize: "76px",
                                                color: error ? "#BFBFBF" : "#BFBFBF",
                                                marginTop: "-12px",
                                                height:"76px"
                                            }}
                                        />


                                        <p style={{ color: !error ? "#BFBFBF" : "#BFBFBF" }}>
                                            {!error ? 'Select from Browser' : 'Select from Browser'}
                                        </p>
                                    </>
                                )}

                              
                            </div>

                            <Form.Group controlId="formSelectTime" className='mt-4 FormGroupContainer'>
                                <Form.Label className='FormLabel' style={{ fontSize: "12px", marginTop: "7px",marginLeft:"10px" }}>
                                    Select Duration
                                </Form.Label>
                                <div className='FormSelectContainer'>
                                    <Form.Control
                                        as="select"
                                        value={selectedTime}
                                        onChange={handleChange}
                                        className='FormSelectControl'
                                    >
                                        <option value={0.5}>0.5</option>
                                        <option value={1}>1</option>
                                        <option value={1.5}>1.5</option>
                                        <option value={2}>2</option>
                                    </Form.Control>
                                    <span className='SecText'>Sec</span>
                                </div>
                            </Form.Group>

                            <button
                                className="play-btn mt-3"
                                style={{ width: "100px", display: "flex", marginLeft: "310px" }}
                                onClick={handleUpload}
                                disabled={!selectedFile}
                            >
                                Upload
                                <ArrowForwardIcon style={{ marginLeft: "5px" }} />
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );

}
export default AllQuestionPage;