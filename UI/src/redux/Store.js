import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import { encryptTransform } from 'redux-persist-transform-encrypt';

const Key = import.meta.env.VITE_API_KEY;

const encryptor = encryptTransform({
  secretKey: Key,
  onError: function (error) {
    throw new Error(error.message);
  },
});

// Function to load initial state from secure storage

const persistConfig = {
  key: 'root',
  storage,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
