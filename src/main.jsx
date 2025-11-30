import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';
import configureStore from './Redux/middleware/configureStore'
import { Provider } from 'react-redux';
import './i18n'; 

const store = configureStore();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <AuthProvider store={configureStore}>
        <App />
      </AuthProvider>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

