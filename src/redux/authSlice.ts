// src/redux/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY, getCookie, removeCookie, setCookie, TOKEN_LIFESPAN_DAYS } from '../utils/cookieUtils';

interface AuthState {
    isAuthenticated: boolean;
    userRole: 'admin' | 'client' | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    userRole: null, 
    isLoading: true,
};


export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { dispatch }) => {
        const token = getCookie(AUTH_TOKEN_KEY);
        
        if (token) {
            const role = getCookie(AUTH_ROLE_KEY); 
            
            let determinedRole: 'admin' | 'client' | null = null;
            
            if (role === 'admin' || role === 'client') {
                determinedRole = role;
            } else {
                determinedRole = token.includes('admin') ? 'admin' : 'client'; 
            }
            
            dispatch(authSlice.actions.setAuth({ 
                isAuthenticated: true, 
                userRole: determinedRole
            }));
        } else {
            dispatch(authSlice.actions.setAuth({ 
                isAuthenticated: false, 
                userRole: null 
            }));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ isAuthenticated: boolean; userRole: AuthState['userRole'] }>) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.userRole = action.payload.userRole;
            state.isLoading = false;
        },
        loginAction: (state, action: PayloadAction<{ token?: string; role: 'admin' | 'client' }>) => {
            const token = action.payload.token || `simulated_jwt_token_${action.payload.role}`;
            setCookie(AUTH_TOKEN_KEY, token, TOKEN_LIFESPAN_DAYS);
            setCookie(AUTH_ROLE_KEY, action.payload.role, TOKEN_LIFESPAN_DAYS); 

            state.isAuthenticated = true;
            state.userRole = action.payload.role;
            state.isLoading = false;
        },
        logoutAction: (state) => {
            removeCookie(AUTH_TOKEN_KEY);
            removeCookie(AUTH_ROLE_KEY); 
            
            state.isAuthenticated = false;
            state.userRole = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state) => {
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.userRole = null;
            });
    }
});

export const { loginAction, logoutAction } = authSlice.actions;
export default authSlice.reducer;