import type { RootState } from '../store';

const LOCAL_STORAGE_KEY = 'theta_lounge_auth';

export const saveToLocalStorage = (state: RootState['auth']) => {
    try {
        const serializedState = JSON.stringify({
            user: state.user,
            userRole: state.userRole,
            adminPermissions: state.adminPermissions,
            isAuthenticated: state.isAuthenticated,
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
        console.log(' Auth state saved to localStorage');
    } catch (error) {
        console.error(' Failed to save auth state to localStorage:', error);
    }
};

export const loadFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (serializedState === null) {
            return undefined;
        }
        const parsed = JSON.parse(serializedState);
        console.log(' Auth state loaded from localStorage:', parsed);
        return parsed;
    } catch (error) {
        console.error(' Failed to load auth state from localStorage:', error);
        return undefined;
    }
};

export const clearLocalStorage = () => {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        console.log(' Auth state cleared from localStorage');
    } catch (error) {
        console.error(' Failed to clear auth state from localStorage:', error);
    }
};

export const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    
    if (action.type?.startsWith('auth/')) {
        const state = store.getState() as RootState;
        saveToLocalStorage(state.auth);
    }
    
    return result;
};

