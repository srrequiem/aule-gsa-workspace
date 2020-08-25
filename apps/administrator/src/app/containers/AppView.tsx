import React, { Component } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import { FullscreenView } from './FullscreenView/FullscreenView';
import { AppDrawer } from '../components';

interface AppViewProps {
    title: string;
}

export class AppView extends Component<AppViewProps> {
    state = { drawerOpen: false };

    toggleDrawer = (event) => {
        const { drawerOpen } = this.state;
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }
        this.setState({ drawerOpen: !drawerOpen });
    };

    render() {
        const { drawerOpen } = this.state;
        return (
            <FullscreenView>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={this.toggleDrawer}
                        >
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {this.props.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <AppDrawer open={drawerOpen} onClose={this.toggleDrawer} />
                {this.props.children}
            </FullscreenView>
        );
    }
}
