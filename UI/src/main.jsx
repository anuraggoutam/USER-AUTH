import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './interceptors/axios';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/Store.js';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
