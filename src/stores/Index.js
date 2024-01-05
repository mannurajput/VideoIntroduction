// store.js

import { configureStore } from '@reduxjs/toolkit';
import videoIntroductionSlice from './Userslice';

const store = configureStore({
    reducer: {
        videoIntroduction: videoIntroductionSlice.reducer,
    },
});

export default store;
