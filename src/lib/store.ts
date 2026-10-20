import { configureStore } from '@reduxjs/toolkit';

// Define the root state type
export type RootState = Record<string, never>;

// Create the store
export const store = configureStore({
    reducer: {
        // Add your reducers here
    },
});

// Export types for use in components
export type AppDispatch = typeof store.dispatch;