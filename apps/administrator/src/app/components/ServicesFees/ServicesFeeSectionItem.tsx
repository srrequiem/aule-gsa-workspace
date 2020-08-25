import React, { Component } from "react";
import {
    Typography,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

import { ServicesFee, Account } from "@aule-gsa-workspace/interfaces";

interface ServicesFeeSectionItemProps {
    item: ServicesFee,
    accounts: Array<Account>,
    onDelete(servicesFeeID: string): void,
    onEdit(servicesFee: ServicesFee): void
}

export class ServicesFeeSectionItem extends Component<ServicesFeeSectionItemProps> {
    state = { anchorEl: null };

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleDelete = () => {
        this.setState({ anchorEl: null });
        this.props.onDelete(this.props.item.id);
    };

    handleEdit = () => {
        const { item } = this.props;
        this.setState({ anchorEl: null });
        this.props.onEdit(item);
    };

    formatDate = () => {
        const options = { day: "numeric", month: "short", year: "numeric" };
        const dtf = new Intl.DateTimeFormat("en-US", options);
        const [
            { value: month },
            ,
            { value: day },
            ,
            { value: year },
        ] = dtf.formatToParts(this.props.item.triggerDate.toDate());
        return `${day}/${month}/${year}`;
    };

    render() {
        const { anchorEl } = this.state;
        const { item } = this.props;
        return (
            <div className="ServicesFeeSectionItem">
                <Card>
                    <CardHeader
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
                        subheader={`Next Charge: ${this.formatDate()}`}
                    />
                    <CardContent>
                        <Typography variant="h6">Charge:</Typography>
                        <Typography variant="body2" color="textSecondary">
                            ${item.amount} will be charge the{" "}
                            {this.formatDate().split("/")[0]} day of the months.
                        </Typography>
                        <Typography variant="h6">Accounts:</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {this.props.accounts
                                .map((account) =>
                                    account ? account.name : null
                                )
                                .join(", ")}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        );
    }
}
