import React from "react";

import { withUnauthentication } from '../hoc/Auth';
import { FullscreenView } from '../containers';
import { LoginForm } from '../components';

const Login = () => (
    <FullscreenView>
        <LoginForm />
    </FullscreenView>
);

export default withUnauthentication(Login);
