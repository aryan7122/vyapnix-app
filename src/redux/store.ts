import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Store aur Dispatch ke types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
