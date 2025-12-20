// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { localStorageMiddleware, loadFromLocalStorage } from './middleware/localStorageMiddleware';

// Load persisted auth state from localStorage
const preloadedAuthState = loadFromLocalStorage();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers here
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    preloadedState: preloadedAuthState ? {
        auth: {
            ...preloadedAuthState,
            isLoading: false,
        }
    } : undefined,
});

// Define types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;