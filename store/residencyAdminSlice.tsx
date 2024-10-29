import { createSlice } from '@reduxjs/toolkit';

// Initial state for the super admin
const initialState = {
    token: "", // Store the authentication token
    isAuthenticated: false, // Authentication status
     // Optional: Store admin-specific data (like user roles, permissions, etc.)

    role:""
};

const residencyAdminSlice = createSlice({
    name: 'residencyAdmin', // Name of the slice
    initialState, // Initial state
    reducers: {
        // Action to set the authentication token and update authentication status
        setToken: (state, action) => {
            state.token = action.payload; // Set the token
            state.isAuthenticated = true; // Update authentication status
        },

        // Action to reset the super admin state
        resetAuth: () => initialState,

        // Optional: Action to set admin-specific data
        setResidencyAdminData: (state, action) => {
            // state.adminData = action.payload;
        },
    },
});

// Export the actions generated from the slice
export const { setToken, resetAuth, setResidencyAdminData } = residencyAdminSlice.actions;

// Export the reducer to be used in the store
export default residencyAdminSlice.reducer;