import React from "react";
import AuthUserContext from "./AuthUserContext";
import { withFirebase } from "../FirebaseContext";

interface WithAuthenticationProps {
    firebase: {
        auth: firebase.auth.Auth;
    };
}

export const withAuthentication = Component => {
    class WithAuthentication extends React.Component<WithAuthenticationProps> {
        private _listener: firebase.Unsubscribe;
        state = {
            authUser: null
        };

        componentDidMount() {
            this._listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    authUser
                        ? this.setState({ authUser })
                        : this.setState({ authUser: null });
                }
            );
        }

        componentWillUnmount() {
            this._listener();
        }
        
        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }
    return withFirebase(WithAuthentication);
};
