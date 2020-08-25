import React from 'react';
import { Typography } from "@material-ui/core";
import { withAuthorization } from '../hoc/Auth';
import { AppView } from '../containers';

const Dashboard = () => (
    <AppView title="Dashboard">
        <Typography variant="h3">Items de dashboard</Typography>
    </AppView>
);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Dashboard);
