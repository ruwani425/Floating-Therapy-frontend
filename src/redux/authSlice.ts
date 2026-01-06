// src/redux/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY, getCookie, removeCookie, setCookie, TOKEN_LIFESPAN_DAYS } from '../utils/cookieUtils';
import { clearLocalStorage } from './middleware/localStorageMiddleware';

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
    role: 'admin' | 'client';
    firebaseUid?: string;
    permissions?: string[]; 
}

interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    userRole: 'admin' | 'client' | null;
    isLoading: boolean;
    adminPermissions: string[]; 
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null, 
    userRole: null, 
    isLoading: true,
    adminPermissions: [], 
};


export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async () => {
        const token = getCookie(AUTH_TOKEN_KEY);
        const role = getCookie(AUTH_ROLE_KEY);
        
        console.log('🔍 Checking auth status:', { 
            hasToken: !!token, 
            role,
            token: token ? `${token.substring(0, 20)}...` : 'none' 
        });
        
        if (token && role) {
            if (role === 'admin' || role === 'client') {
                return { 
                    isAuthenticated: true, 
                    userRole: role as 'admin' | 'client'
                };
            }
        }
        
        return { 
            isAuthenticated: false, 
            userRole: null 
        };
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
        loginAction: (state, action: PayloadAction<{ token?: string; role: 'admin' | 'client'; user?: AuthUser }>) => {
            const token = action.payload.token || `simulated_jwt_token_${action.payload.role}`;
            
            console.log('Login action:', { 
                role: action.payload.role,
                hasToken: !!action.payload.token,
                tokenPreview: token.substring(0, 20) + '...'
            });
            
            setCookie(AUTH_TOKEN_KEY, token, TOKEN_LIFESPAN_DAYS);
            setCookie(AUTH_ROLE_KEY, action.payload.role, TOKEN_LIFESPAN_DAYS);
            
            const savedToken = getCookie(AUTH_TOKEN_KEY);
            const savedRole = getCookie(AUTH_ROLE_KEY);
            console.log('Cookies saved:', { 
                tokenSaved: !!savedToken, 
                roleSaved: savedRole 
            });

            state.isAuthenticated = true;
            state.userRole = action.payload.role;
            state.user = action.payload.user || null;
            state.isLoading = false;
        },
        setAdminPermissionsAction: (state, action: PayloadAction<string[]>) => {
            state.adminPermissions = action.payload;
            
            if (state.user && state.user.role === 'admin') {
                state.user.permissions = action.payload; 
            }
            console.log('Admin permissions set:', action.payload);
        },
        logoutAction: (state) => {
            console.log('Logout action');
            
            removeCookie(AUTH_TOKEN_KEY);
            removeCookie(AUTH_ROLE_KEY);
            clearLocalStorage();
            
            const tokenRemoved = !getCookie(AUTH_TOKEN_KEY);
            const roleRemoved = !getCookie(AUTH_ROLE_KEY);
            console.log('Cookies and localStorage cleared:', { tokenRemoved, roleRemoved });
            
            state.isAuthenticated = false;
            state.userRole = null;
            state.user = null;
            state.adminPermissions = []; 
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.userRole = action.payload.userRole;
                console.log('Auth status loaded:', { 
                    isAuthenticated: state.isAuthenticated, 
                    userRole: state.userRole 
                });
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.userRole = null;
                console.log('Auth check failed');
            });
    }
});

export const { loginAction, logoutAction, setAdminPermissionsAction } = authSlice.actions;
export default authSlice.reducer;