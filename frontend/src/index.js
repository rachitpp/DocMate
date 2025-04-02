import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StoreProvider } from './store/store';
import { initialState, userReducer } from './store/reducers/userReducer';
import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StoreProvider initialState={initialState} reducer={userReducer}>
        <CssVarsProvider>
            <div>
                <App />
            </div>
        </CssVarsProvider>
    </StoreProvider>
);