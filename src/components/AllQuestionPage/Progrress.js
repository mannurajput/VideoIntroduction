import React, { useState, useEffect } from 'react';
import { Progress, Box } from '@chakra-ui/react';
import './AllQuestionPage.css';
const ProgressBar = ({
    number, onComplete, currentQuestionNumber, isFilling, isRefeal, setIsRefeal, setIsEnable, setIsPlaybackEnabled, stopRecording, isActive: propIsActive, }) => {
    const [progressValue, setProgressValue] = useState(10);
    const [prevQuestionNumber, setPrevQuestionNumber] = useState(0);

    const getBackgroundColor = () => {
        return number < currentQuestionNumber ? '#33b0ca' : '#33b0ca';
    };
    const getCompletionTime = (questionNumber) => {
        switch (questionNumber) {
            case 1:
            case 2:
            case 3:
            case 5:
            case 6:
            case 7:
                return 8000; // 5 seconds
            case 4:
            case 8:
            case 9:
                return 12000; // 10 seconds
            case 10:
                return 17000; // 15 seconds
            default:
                return 7000; // Default timer for unknown questions
        }
    };
    const completionTime = getCompletionTime(currentQuestionNumber);

    //increasing the progressbar with timers
    useEffect(() => {
        if (isRefeal) {
            setProgressValue(0)   
             setIsRefeal(false);
             setIsEnable(false);
             setIsPlaybackEnabled(false);
            }
        // Save the currentQuestionNumber for the next iteration
        setPrevQuestionNumber(currentQuestionNumber);
        if (currentQuestionNumber === number && isFilling) {
   
        if (progressValue <=100) {
            const increment = (100 / completionTime) * 1500;
            const interval = setInterval(() => {
                setProgressValue((prevValue) => prevValue + increment);
            }, 1000);
            return () => clearInterval(interval);
        } else if (progressValue === 100) {
            onComplete()
        }
        }
        if (currentQuestionNumber === number && isRefeal) {
                const increment1 = (1000 / completionTime) * 1500;
                const interval1 = setInterval(() => {
                    setProgressValue((prevValue) => prevValue + increment1);
                }, 1000);
                return () => clearInterval(interval1);
            } else if (progressValue === 100) {
                onComplete();
            }
        

        if (currentQuestionNumber !== prevQuestionNumber) {
            // Reset progressValue to 0 when question changes
            setProgressValue(0);
            setIsEnable(false);
        } else {
            if (isFilling && progressValue > 79) {
                setIsEnable(true);
                setIsPlaybackEnabled(true);
                stopRecording()
            } else if (isRefeal && progressValue > 79) {
                setIsEnable(true);
                setIsPlaybackEnabled(true);
                stopRecording()

            }
        }     
    }, [currentQuestionNumber, number, isFilling, isRefeal, onComplete, progressValue, completionTime, setIsEnable, setIsPlaybackEnabled, stopRecording]);
 
//set width for the per boxes
    const getHeight = () => {
        switch (number) {
            case 4:
            case 8:
            case 9:
                return '64px';
            case 10:
                return '96px';
            default:
                return '32px';
        }
    };


    const isActive = propIsActive && 10 - number === currentQuestionNumber && isFilling && isRefeal;
    // Additional styles for the progress bar
    const progressBarStyle = {
        height: '100%', // Set the height to 100%
        display: 'flex',
        flexDirection: 'column-reverse', // Display flex in column direction, but reverse the order
    };


    return (
        <div className={`progressbar-container ${isActive ? 'active' : ''}`}>
            <div className="progressbar" style={progressBarStyle}>
                <Box
                    position="relative"
                    height={getHeight()} // Set the height based on the box number
                    width="52px"
                    display="inline-block"
                    borderBottom="3px"
                >
                    <Progress
                        colorScheme="cyan"
                        className="progressBar"
                        value={progressValue}
                        width="100%" // Set the width to 100%
                        background={getBackgroundColor}
                        height={getHeight()}
                        style={{ display: 'flex', flexDirection: 'column', transform: 'scaleY(-1)', borderTop:"1px solid #B1AFAF",}}
                    />
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        fontSize="16px"
                        fontWeight="bold"
                        color="black" // Add a text color for better visibility
                    >
                        {number}
                    </Box>
                </Box>

            </div>
        </div>

    );
};

export default ProgressBar;
