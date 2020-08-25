import React, { Component } from 'react';
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    Button,
    IconButton,
    Menu,
    MenuItem,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import { Account } from '@aule-gsa-workspace/interfaces';

interface AccountSectionItemProps {
    item: Account;
    onDelete(accountId: string): void;
    onEdit(account: Account): void;
    onAddPayment(accountId: string): void;
}

export class AccountSectionItem extends Component<AccountSectionItemProps> {
    state = { anchorEl: null };

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleDelete = () => {
        const { item } = this.props;
        this.setState({ anchorEl: null });
        this.props.onDelete(item.id);
    };

    handleEdit = () => {
        const { item } = this.props;
        this.setState({ anchorEl: null });
        this.props.onEdit(item);
    };

    handlePayment = () => {
        const { item } = this.props;
        this.setState({ anchorEl: null });
        this.props.onAddPayment(item.id);
    };

    render() {
        const { anchorEl } = this.state;
        const { item } = this.props;
        return (
            <div className="AccountSectionItem">
                <Card>
                    <CardHeader
                        avatar={<Avatar aria-label="account">G</Avatar>}
                        action={
                            <div>
                                <IconButton
                                    aria-label="account-item-options"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={this.handleClick}
                                >
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={this.handlePayment}>
                                        Add Payment
                                    </MenuItem>
                                    <MenuItem onClick={this.handleEdit}>
                                        Edit
                                    </MenuItem>
                                    <MenuItem onClick={this.handleDelete}>
                                        Delete
                                    </MenuItem>
                                </Menu>
                            </div>
                        }
                        title={item.name}
                        subheader={`${item.email} - ${item.phone}`}
                    />
                    <CardContent>
                        <Typography>Balance: {item.balance}</Typography>
                        <Typography>
                            Reminders: {item.reminders.join(', ')}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Show Payments</Button>
                        <Button size="small">Show Fees</Button>
                    </CardActions>
                </Card>
            </div>
        );
    }
}
