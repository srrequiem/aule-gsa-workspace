import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import AuthUserContext from './AuthUserContext';
import { withFirebase } from '../FirebaseContext';
import { Routes } from '../../constants/Routes';

interface WithAuthProps extends RouteComponentProps {
    firebase: {
        auth: firebase.auth.Auth;
    };
}

export const withAuthorization = (condition) => (Component) => {
    class WithAuthorization extends React.Component<WithAuthProps> {
        private _listener: firebase.Unsubscribe;
        componentDidMount() {
            this._listener = this.props.firebase.auth.onAuthStateChanged(
                (authUser) => {
                    if (!condition(authUser)) {
                        this.props.history.push(Routes.LOGIN);
                    }
                }
            );
        }

        componentWillUnmount() {
            this._listener();
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {(authUser) =>
                        condition(authUser) ? (
                            <Component {...this.props} />
                        ) : null
                    }
                </AuthUserContext.Consumer>
            );
        }
    }
    return compose(withRouter, withFirebase)(WithAuthorization);
};
