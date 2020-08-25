import React from 'react';
import { Paper } from '@material-ui/core';
import './FullscreenView.css';

export const FullscreenView = (props) => (
    <Paper square={true} elevation={0} className="Fullscreen">
        {props.children}
    </Paper>
);
