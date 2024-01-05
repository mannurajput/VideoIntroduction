
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './FinalPage.css';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFinalVideo, deleteVideoIntroduction, createVideoIntroduction } from '../../stores/Userslice';
import ReactPlayer from 'react-player';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
const FinalPage = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [isChecked, setIsChecked] = useState(false); // State to track checkbox selection
    const [userName, setUserName] = useState("");
    const [videoPath, setVideoPath] = useState("");
    const [isDisable, setIsDisable] = useState(false);
    const [profileCheckbox, setProfileCheckbox] = useState(false);
    const [viewersCheckbox, setViewersCheckbox] = useState(false);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken')); // Define setAccessToken
    const [videoPostedForProfile, setVideoPostedForProfile] = useState(false);
    const [videoPostedForViewers, setVideoPostedForViewers] = useState(false);
    const [videoPostedForBoth, setVideoPostedForBoth] = useState(false);
    const finalVideoData = useSelector((state) => state.videoIntroduction.finalVideoData);
    const { data, loading, error } = useSelector((state) => state.videoIntroduction);
    const dispatch = useDispatch();
  const navigate=useNavigate();
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };
    const handleCheckboxChange = (checkboxType) => {
        if (checkboxType === 'profile') {
            setProfileCheckbox(!profileCheckbox);
        } else if (checkboxType === 'viewers') {
            setViewersCheckbox(!viewersCheckbox);
        }
    };
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken); // Use setAccessToken to set the state

        if (storedAccessToken && !finalVideoData) {
            dispatch(fetchFinalVideo(storedAccessToken))
                .unwrap()
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        if (finalVideoData && finalVideoData.video) {
            const videoPath = finalVideoData.video;
            const baseURL = 'https://mynextfilm.ai';

            // Concatenate the base URL with the video path
            const fullVideoURL = baseURL + videoPath;

            // Now you can use fullVideoURL as the complete video path
            setVideoPath(fullVideoURL);
        }
        if (data && data?.username) {
            setUserName(data?.username);
        }
    }, [dispatch, finalVideoData, data]);

    //handling the delete functionality
    const handleDeleteVideo = () => {
        localStorage.setItem("currentQuestionNumber",1)
        if (accessToken) {
            dispatch(deleteVideoIntroduction(accessToken))
                .unwrap()
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        window.alert("Your video has deleted successfully")
        let host = window.location.origin + `/viewerlounge/videointroduction`;
        window.location.href = host;
    };

    const handlePost = () => {
        setShowPopup(!showPopup);

        const baseUrl = 'https://mynextfilm.ai/viewerlounge/';
        if (viewersCheckbox && !profileCheckbox) {
            // Axios POST request for Viewers Lounge
            axios.post(`${baseUrl}post-video-introduction-publicly/`, { data: 'your_data' }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    // Handle the response if needed
                    console.log(response.data);
                })
                .catch(error => {
                    // Handle the error if needed
                    console.error(error);
                });
        } else if (!viewersCheckbox && profileCheckbox) {
            // Axios POST request for Member Profile
            axios.post(`${baseUrl}Post_member_profile/`, { data: 'your_data' },{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                
                .then(response => {
                    // Handle the response if needed
                    console.log(response.data);
                })
                .catch(error => {
                    // Handle the error if needed
                    console.error(error);
                });
        } else if (viewersCheckbox && profileCheckbox) {
            // Axios POST request for both with authentication
            axios.post(`${baseUrl}post-video-introduction-publicly/`, { data: 'your_data' }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    // Handle the response if needed
                    console.log(response.data);
                })
                .catch(error => {
                    // Handle the error if needed
                    console.error(error);
                });

            axios.post(`${baseUrl}Post_member_profile/`, { data: 'your_data' }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    // Handle the response if needed
                    console.log(response.data);
                })
                .catch(error => {
                    // Handle the error if needed
                    console.error(error);
                });
        }
        if (profileCheckbox) {
            setVideoPostedForProfile(true);
        }
        if (viewersCheckbox) {
            setVideoPostedForViewers(true);
        }
        if (profileCheckbox && viewersCheckbox) {
            setVideoPostedForBoth(true);
        }
    };
   
    const containerStyle = {
        backgroundColor: showPopup ? 'rgba(37, 37, 37, 0.9)' : 'transparent', // Adjust opacity as needed
        height: '100vh',
        position: 'relative',
    };

    const headingStyle = {
        fontSize: '2rem',
        textAlign: 'center',
        color: '#ffffff',
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: showPopup ? 'rgba(37, 37, 37, 0.75)' : 'transparent', // Adjust opacity as needed
        opacity: showPopup ? 1 : 0,
        transition: 'opacity 0.3s ease',
    };
    const handleEditClick = () => {
        navigate("/Previewpage")
    }
    return (
        <div style={showPopup ? containerStyle : {}} className='container-fluid2' id='final-video'>
            <h3 style={showPopup ? headingStyle : {}} className='w3-wide text-center user_nameee mt-5'></h3>
            <div className="video-container2 mt-5">
                <ReactPlayer
                    url={videoPath}
                    width={887}
                    height={462}
                    controls={true}
                    style={{ borderRadius: '8px !important' }}
                />
                <div className="buttons-container">
                    <button className='button_final ' onClick={handleEditClick}>Edit</button>
                    <button className='button_final mx-5'  onClick={handleDeleteVideo} disabled={isDisable}>{!isDisable ? "Delete & Re-Create" : "Posted"}</button>

                    <button className='button_final ' style={{marginLeft:"450px"}}  onClick={togglePopup}>Post<ArrowForwardIcon/></button>
                </div>
                <div style={showPopup ? overlayStyle : {}}></div>
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                           {(!videoPostedForProfile && (   <div className="checkbox-container">
                              
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={profileCheckbox}
                                            onChange={() => handleCheckboxChange('profile')}
                                        />
                                        on My Profile Page
                                    </label> </div>
                                ))}
                            {(!videoPostedForViewers && (
                                <div className="checkbox-container">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={viewersCheckbox}
                                            onChange={() => handleCheckboxChange('viewers')}
                                        />
                                        in Viewers Lounge
                                    </label>
                                    </div>
                                ))}
                           
                            {(!videoPostedForBoth && (
                                <button
                                    className="button_final mt-3"
                                    style={{ width: "97px", marginLeft: "202px" }}
                                    disabled={!profileCheckbox && !viewersCheckbox}
                                    onClick={handlePost}
                                >
                                    Post <ArrowForwardIcon />{/* Add your ArrowForwardIcon here */}
                                </button>
                            ))}
                            {( videoPostedForBoth) && (
                                <p>You have already posted your video introduction.</p>
                            )}
                            <div className="close-icon" onClick={togglePopup}>
                                <CloseIcon style={{ fontSize: '22px', cursor: 'pointer', color: "#F7F7F7" }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinalPage;
