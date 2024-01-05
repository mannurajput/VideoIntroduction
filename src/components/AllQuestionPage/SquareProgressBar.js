import React, { useState, useEffect } from 'react';
import { Box, VStack, Text } from '@chakra-ui/react';

const ProgressBarGroup = ({ currentQuestionNumber, isFilling,isRefeal }) => {
    const [progressValues, setProgressValues] = useState(Array(11).fill(0));


    const indices = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    // Set default value based on currentQuestionNumber using a switch case
    const getDefaultContainBottom = () => {
        switch (currentQuestionNumber) {
            case 2:
                return 28;
            case 3:
                return 62;
            case 4:
                return 97;
            case 5:
                return 166;
            case 6:
                return 200;
            case 7:
                return 234;
            case 8:
                return 268;
            case 9:
                return 336;
            case 10:
                return 403;
            default:
                return -3;
        }
    };
    // Update containBottom when currentQuestionNumber changes
    useEffect(() => {
        setContainBottom(getDefaultContainBottom());
    }, [currentQuestionNumber]);
    const [containBottom, setContainBottom] = useState(getDefaultContainBottom);
    const increaseProgress = (index) => {
        setProgressValues((prevValues) => {
            const newValues = [...prevValues];
            newValues[index] = Math.min(newValues[index] + 20, 100);
            return newValues;
        });
    };

    const increaseContainBottom = () => {
        setContainBottom((prevBottom) => {
            switch (currentQuestionNumber) {
                case 2:
                    return prevBottom + 6.8;
                case 3:
                    return prevBottom + 7.1;
                case 4:
                    return prevBottom + 13.4;
                case 5:
                case 6:
                case 7:
                    return prevBottom + 6.8;
                case 8:
                case 9:
                    return prevBottom + 13.4;
                case 10:
                    return prevBottom + 20;
                default:
                    return prevBottom + 6.3;
            }
        });
    };


    useEffect(() => {
        let timer;
        let updateCount = 0;

        const getIntervalTime = () => {
            if (currentQuestionNumber === 10) {
                return 3000; // 15 seconds for question 10
            } else if (currentQuestionNumber === 4 || currentQuestionNumber === 8 || currentQuestionNumber === 9) {
                return 2000; // 10 seconds for questions 4, 8, 9
            } else {
                return 1000; // 5 seconds for other questions
            }
        };

      
            if (isRefeal) {
                setContainBottom(getDefaultContainBottom());

                setProgressValues(Array(11).fill(0));
            } 
        


        if (isFilling) {
            timer = setInterval(() => {
                if (updateCount < 5) {
                    increaseProgress(currentQuestionNumber);
                    increaseContainBottom();
                    updateCount++;
                } else {
                    clearInterval(timer);
                }
            }, getIntervalTime());
        }

        return () => {
            clearInterval(timer);
        };
    }, [isFilling, currentQuestionNumber, isRefeal]);

  

    const getBoxHeight = (index) => {
        switch (index) {
            case 11:
                return '102px';
            case 10:
            case 9:
            case 5:
                return '68px';
            default:
                return '34px';
        }
    };
    const getBackgroundColor = (index) => {
        if (index <= currentQuestionNumber) {
            return '#33b0ca'; // Background color for boxes up to the current question number
        }
        return '#EDEDED'; // Default background color
    };

    return (
        <div>
        <VStack spacing="0px" align="flex-start" direction="column-reverse">
            {indices.map((index) => (
                <Box
                    key={index}
                    bg={getBackgroundColor(index)}
                    h={getBoxHeight(index)}
                    w="52px"
                    position="relative"
                    overflow="hidden"
                    borderRadius={
                        index === 2 ? ' 0 0 6px 6px' : index === 11 ? ' 6px 6px 0 0' : '0'
                    }
                    borderTop={index === 11 ? 'none' : '1px solid #B1AFAF'}
                >
                    <Box
                        bg="#33b0ca"
                        h={`${progressValues[index - 1]}%`}

                        width="100%"
                        transition="height 0.3s ease"
                        position="absolute"
                        bottom="0"
                    />
                    <Text
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        color="black"
                        fontWeight="bold"
                        className='notranslate'
                        translate="no"
                    >
                        {index-1}
                    </Text>
                </Box>
            ))}
            </VStack>
            <div className="contain" style={{ bottom: `${containBottom}px` }}>

                <div className="rectangle"></div>
                <div className="line"></div>
            </div>
        </div>
    );
};

export default ProgressBarGroup;
