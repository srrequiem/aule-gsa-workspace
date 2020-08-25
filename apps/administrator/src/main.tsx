import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import App from './app/app';
import FirebaseContext from './app/hoc/FirebaseContext';
import Firebase from './app/providers/Firebase';

const THEME = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

// const THEME = createMuiTheme();

ReactDOM.render(
    <React.StrictMode>
        <FirebaseContext.Provider value={new Firebase()}>
            <ThemeProvider theme={THEME}>
                <App />
            </ThemeProvider>
        </FirebaseContext.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
