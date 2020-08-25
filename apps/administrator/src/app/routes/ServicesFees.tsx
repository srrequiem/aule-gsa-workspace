import React, { Component } from 'react';
import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { withAuthorization } from '../hoc/Auth';
import { AppView } from '../containers';
import { ServicesFeeSection } from '../containers';
import {
    ServicesFeeSectionItem,
    ServicesFeeDialogForm,
    DeleteDialog,
} from '../components';
import Firebase from '../providers/Firebase';

interface ServicesFeesProps {
    firebase: Firebase
}

class ServicesFees extends Component<ServicesFeesProps> {
    state = {
        formDialogOpen: false,
        servicesFees: [],
        servicesFeesAccounts: {},
        servicesFeeID: '',
        deleteDialogOpen: false,
        itemToEdit: {},
    };

    componentDidMount() {
        const servicesFees = [];
        this.props.firebase
            .getServicesFees()
            .then((snapshots) => {
                snapshots.forEach((doc) =>
                    servicesFees.push({ id: doc.id, ...doc.data() })
                );
                this.setState({ servicesFees });
            })
            .then(() => {
                const accountPromises = [];
                const accounts = [];
                for (let servicesFee of servicesFees) {
                    for (let accountID of servicesFee.accountsIDS) {
                        if (!accounts.includes(accountID)) {
                            accounts.push(accountID);
                            accountPromises.push(
                                this.props.firebase.getAccount(accountID)
                            );
                        }
                    }
                }
                Promise.all(accountPromises).then((docs) => {
                    const servicesFeesAccounts = {};
                    for (let doc of docs) {
                        servicesFeesAccounts[doc.id] = doc.data();
                    }
                    this.setState({ servicesFeesAccounts });
                });
            });
    }

    onCreate = () => {
        this.setState({ formDialogOpen: true, itemToEdit: {} });
    };

    onEdit = (itemToEdit) => {
        this.setState({ formDialogOpen: true, itemToEdit });
    };

    onDelete = (servicesFeeID) => {
        this.setState({ servicesFeeID, deleteDialogOpen: true });
    };

    handleDeleteConfirmation = (decision) => {
        if (decision) {
            const { servicesFeeID } = this.state;
            this.props.firebase
                .deleteServicesFee(servicesFeeID)
                .then(() => {
                    this.setState({ deleteDialogOpen: false });
                })
                .catch((error) => console.log(error));
        } else {
            this.setState({ deleteDialogOpen: false });
        }
    };

    onClose = () => {
        this.setState({ formDialogOpen: false });
    };

    renderSectionItems = () => {
        const { servicesFees, servicesFeesAccounts } = this.state;
        return servicesFees.map((servicesFee) => {
            const accounts = [];
            for (let accountID of servicesFee.accountsIDS) {
                if (servicesFeesAccounts[accountID]) {
                    accounts.push(servicesFeesAccounts[accountID]);
                }
            }
            return (
                <ServicesFeeSectionItem
                    key={servicesFee.id}
                    item={servicesFee}
                    accounts={accounts}
                    onDelete={this.onDelete}
                    onEdit={this.onEdit}
                />
            );
        });
    };

    render() {
        const { formDialogOpen, deleteDialogOpen, itemToEdit } = this.state;
        return (
            <AppView title="Services Fees">
                <ServicesFeeSection>
                    {this.renderSectionItems()}
                </ServicesFeeSection>
                <ServicesFeeDialogForm
                    open={formDialogOpen}
                    itemToEdit={itemToEdit}
                    onClose={this.onClose}
                />
                <DeleteDialog
                    entity="services fee"
                    open={deleteDialogOpen}
                    handleConfirmation={this.handleDeleteConfirmation}
                />
                <Fab
                    aria-label="Add"
                    color="primary"
                    onClick={this.onCreate}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                    }}
                >
                    <Add />
                </Fab>
            </AppView>
        );
    }
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(ServicesFees);
