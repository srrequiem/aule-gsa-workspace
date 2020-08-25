import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import AuthUserContext from './AuthUserContext';
import { withFirebase } from '../FirebaseContext';
import { Routes } from '../../constants/Routes';

interface WithUnauthProps extends RouteComponentProps {
    firebase: {
        auth: firebase.auth.Auth;
    };
}

export const withUnauthentication = (Component) => {
    class WithUnauthentication extends React.Component<WithUnauthProps> {
        private _listener: firebase.Unsubscribe;
        state = {
            loadHasFinish: false,
        };

        componentDidMount() {
            this._listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if (authUser) {
                        this.props.history.push(Routes.DASHBOARD);
                        return;
                    }
                    this.setState({ loadHasFinish: true });
                }
            );
        }

        componentWillUnmount() {
            this._listener();
        }

        render() {
            const { loadHasFinish } = this.state;
            return (
                <AuthUserContext.Consumer>
                    {(authUser) =>
                        !authUser && loadHasFinish ? (
                            <Component {...this.props} />
                        ) : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }
    return compose(withRouter, withFirebase)(WithUnauthentication);
};
