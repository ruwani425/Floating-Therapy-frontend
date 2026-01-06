// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { localStorageMiddleware, loadFromLocalStorage } from './middleware/localStorageMiddleware';

const preloadedAuthState = loadFromLocalStorage();

export const store = configureStore({
    reducer: {
        auth: authReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;