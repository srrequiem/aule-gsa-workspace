import React, { Component } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { Routes } from '../constants/Routes';
import { withFirebase } from '../hoc/FirebaseContext';
import { isEmailValid } from '../utils/Validation';
import Firebase from '../providers/Firebase';

interface LoginFormProps extends RouteComponentProps {
    firebase: Firebase;
}

class LoginForm extends Component<LoginFormProps> {
    state = {
        email: {
            value: '',
            helperText: '',
        },
        password: {
            value: '',
            helperText: '',
        },
    };

    onLogin = (event) => {
        const { email, password } = this.state;
        event.preventDefault();
        if (this.isLoginFormValid()) {
            this.props.firebase
                .signInWithEmailAndPassword(email.value, password.value)
                .then(() => this.props.history.push(Routes.DASHBOARD))
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    isLoginFormValid = () => {
        return this.isEmailValid() && this.isPasswordValid();
    };

    isEmailValid = () => {
        const { email } = this.state;
        return email.helperText === '';
    };

    isPasswordValid = () => {
        const { password } = this.state;
        return password.helperText === '';
    };

    validateEmail = () => {
        const { email } = this.state;
        const validateEmailState = { ...email, helperText: '' };
        if (!isEmailValid(email.value)) {
            validateEmailState.helperText =
                'You must enter a valid email address';
        }
        this.setState({ email: validateEmailState });
    };

    validatePassword = () => {
        const { password } = this.state;
        const validatePassState = { ...password, helperText: '' };
        if (password.value.length < 1) {
            validatePassState.helperText = 'Please enter your password';
        }
        this.setState({ password: validatePassState });
    };

    render() {
        const { email, password } = this.state;
        return (
            <form onSubmit={this.onLogin}>
                <Typography variant="h3">Login</Typography>
                <TextField
                    required
                    error={!this.isEmailValid()}
                    helperText={email.helperText}
                    value={email.value}
                    onBlur={this.validateEmail}
                    onChange={(e) =>
                        this.setState({
                            email: { ...email, value: e.target.value },
                        })
                    }
                    type="email"
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                />
                <TextField
                    required
                    error={!this.isPasswordValid()}
                    helperText={password.helperText}
                    value={password.value}
                    onBlur={this.validatePassword}
                    onChange={(e) =>
                        this.setState({
                            password: { ...password, value: e.target.value },
                        })
                    }
                    type="password"
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                />
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </form>
        );
    }
}

export default compose(withRouter, withFirebase)(LoginForm);
