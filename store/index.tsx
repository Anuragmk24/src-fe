import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from '@/store/themeConfigSlice';
import adminSlice from '@/store/adminSlice'
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist';
import residencyAdminSlice from '@/store/residencyAdminSlice'


// Define a persist config
const persistConfig = {
    key: 'root',
    storage,
};


const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    admin:adminSlice,
    residencyAdmin:residencyAdminSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
});

// Create a persistor
export const persistor = persistStore(store);

export default store;

export type IRootState = ReturnType<typeof rootReducer>;
