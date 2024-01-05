// videoIntroductionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Import Axios

// Define your initial state
const initialState = {
    data: null,
    loading: false,
    error: null,
};

// Create an async thunk action
export const fetchVideoIntroduction = createAsyncThunk(
    'videoIntroduction/fetchData',
    async (accessToken, thunkAPI) => {
        try {
            // Make the API request with Axios and the access token
            const response = await axios.get('https://mynextfilm.ai/viewerlounge/videoIntroduction', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Check if the response is successful
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            // Access the data from Axios response
            const data = response.data;

            // Return the data to be stored in the Redux store
            return data;
        } catch (error) {
            // Handle any errors and reject the promise with an error message
            return thunkAPI.rejectWithValue('Failed to fetch data');
        }
    }
);

// Create an async thunk action for posting video introduction publicly
export const createVideoIntroduction = createAsyncThunk(
    'videoIntroduction/createVideo',
    async ({ accessToken, videoData }, thunkAPI) => {
        try {
            // Make a POST request to create a video introduction publicly
            const response = await axios.post('https://mynextfilm.ai/viewerlounge/post-video-introduction-publicly', videoData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Check if the response is successful
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            // Access the data from Axios response if needed
            const responseData = response.data;

            // Return any data you want to store in the Redux store
            return responseData;
        } catch (error) {
            // Handle errors and reject the promise with an error message
            return thunkAPI.rejectWithValue('Failed to post video introduction publicly');
        }
    }
);
export const fetchFinalVideo = createAsyncThunk(
    'videoIntroduction/fetchFinalVideo',
    async (accessToken, thunkAPI) => {
        try {
            // Make the API request to fetch the final video with Axios and the access token
            const response = await axios.get('https://mynextfilm.ai/viewerlounge/api/video-introduction', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Check if the response is successful
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            // Access the data from Axios response
            const finalVideoData = response.data;

            // Return the final video data to be stored in the Redux store
            return finalVideoData;
        } catch (error) {
            // Handle any errors and reject the promise with an error message
            return thunkAPI.rejectWithValue('Failed to fetch final video');
        }
    }
);
// Create an async thunk action for deleting the video
export const deleteVideoIntroduction = createAsyncThunk(
    'videoIntroduction/deleteVideo',
    async (accessToken, thunkAPI) => {
        try {
            // Make the DELETE request to delete the video
            const response = await axios.delete('https://mynextfilm.ai/viewerlounge/delete-video-introduction/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Check if the response is successful
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }

            // Return success message or other data if needed
            return 'Video deleted successfully';
        } catch (error) {
            // Handle errors and reject the promise with an error message
            return thunkAPI.rejectWithValue('Failed to delete video');
        }
    }
);

const videoIntroductionSlice = createSlice({
    name: 'videoIntroduction',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Handle pending state for createVideoIntroduction
            .addCase(createVideoIntroduction.pending, (state) => {
                state.creatingVideo = true;
                state.createVideoError = null;
            })
            // Handle fulfilled state for createVideoIntroduction
            .addCase(createVideoIntroduction.fulfilled, (state, action) => {
                state.creatingVideo = false;
                state.createVideoSuccessMessage = action.payload; // Store success message
            })
            // Handle rejected state for createVideoIntroduction
            .addCase(createVideoIntroduction.rejected, (state, action) => {
                state.creatingVideo = false;
                state.createVideoError = action.payload; // Store error message
            })
            // Handle pending state for fetchVideoIntroduction
            .addCase(fetchVideoIntroduction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Handle fulfilled state for fetchVideoIntroduction
            .addCase(fetchVideoIntroduction.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            // Handle rejected state for fetchVideoIntroduction
            .addCase(fetchVideoIntroduction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle pending state for fetchFinalVideo
            .addCase(fetchFinalVideo.pending, (state) => {
                state.loadingFinalVideo = true; // Add a new loading state for final video
                state.finalVideoError = null; // Add a new error state for final video
            })
            // Handle fulfilled state for fetchFinalVideo
            .addCase(fetchFinalVideo.fulfilled, (state, action) => {
                state.loadingFinalVideo = false;
                state.finalVideoData = action.payload; // Store final video data
            })
            // Handle rejected state for fetchFinalVideo
            .addCase(fetchFinalVideo.rejected, (state, action) => {
                state.loadingFinalVideo = false;
                state.finalVideoError = action.payload; // Store final video error
            })
          // Handle pending state for deleteVideoIntroduction
            .addCase(deleteVideoIntroduction.pending, (state) => {
                state.deletingVideo = true;
                state.deleteVideoError = null;
            })
        // Handle fulfilled state for deleteVideoIntroduction
        .addCase(deleteVideoIntroduction.fulfilled, (state, action) => {
            state.deletingVideo = false;
            // You can handle success here, e.g., store a success message
            state.deleteVideoSuccessMessage = action.payload;
        })
        // Handle rejected state for deleteVideoIntroduction
        .addCase(deleteVideoIntroduction.rejected, (state, action) => {
            state.deletingVideo = false;
            // Handle errors here, e.g., store an error message
            state.deleteVideoError = action.payload;
        });
    },

});

export default videoIntroductionSlice;
