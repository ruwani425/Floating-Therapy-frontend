// src/components/AuthProvider.tsx
import React, { useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { store } from '../redux/store'; 
import { checkAuthStatus, loginAction, logoutAction } from '../redux/authSlice';


interface AuthProviderProps {
    children: React.ReactNode;
}

// --- AuthInitializer Component ---

const AuthInitializer: React.FC<AuthProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth); 

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
                <p className="ml-4 text-gray-700">Loading authentication status...</p>
            </div>
        );
    }
    
    return <>{children}</>;
}


// --- AuthProvider Component ---

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
};


// --- useAuth Hook ---

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth = useSelector((state: RootState) => state.auth);

    return {
        isAuthenticated: auth.isAuthenticated,
        userRole: auth.userRole,
        isLoading: auth.isLoading,
        login: (role: 'admin' | 'client', token?: string) => dispatch(loginAction({ role, token })),
        logout: () => dispatch(logoutAction()),
    };
};