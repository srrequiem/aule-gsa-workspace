import React, { Component } from 'react';
import {
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Select,
    MenuItem,
} from '@material-ui/core';
import {
    Person,
    Phone,
    Email,
    AccountBalance,
    LocalAtm,
    AddAlert,
} from '@material-ui/icons';

import { Account } from "@aule-gsa-workspace/interfaces";
import {
    isEmailValid,
    isFloatValid,
    isObjectEmpty,
} from '../../utils/Validation';
import { withFirebase } from '../../hoc/FirebaseContext';
import Firebase from '../../providers/Firebase';

interface AccountDialogFormProps {
    firebase: Firebase,
    itemToEdit: Account,
    onClose(error?: string): void,
    open: boolean
}

const REMINDERS = ['Email', 'SMS'];
class AccountDialogForm extends Component<AccountDialogFormProps> {
    state = {
        formTitleAction: 'New',
        submitFormButtonTitle: 'Add account',
        name: {
            value: '',
            helperText: '',
        },
        phone: {
            value: '',
            helperText: '',
        },
        email: {
            value: '',
            helperText: '',
        },
        balance: {
            value: 0,
            helperText: '',
        },
        reminders: {
            value: [],
            helperText: '',
        },
        servicesFeesIDS: {
            value: [],
            helperText: '',
        },
        fetchedServicesFees: [],
    };

    componentDidMount() {
        this.props.firebase.getServicesFees().then((snapshots) => {
            const fetchedServicesFees = [];
            snapshots.forEach((doc) =>
                fetchedServicesFees.push({ id: doc.id, ...doc.data() })
            );
            this.setState({ fetchedServicesFees });
        });
    }

    componentDidUpdate(prevProps) {
        const { itemToEdit } = this.props;
        if (prevProps.itemToEdit !== itemToEdit) {
            if (isObjectEmpty(itemToEdit)) {
                this.setState({
                    formTitleAction: 'New',
                    submitFormButtonTitle: 'Add account',
                    name: {
                        value: '',
                        helperText: '',
                    },
                    phone: {
                        value: '',
                        helperText: '',
                    },
                    email: {
                        value: '',
                        helperText: '',
                    },
                    balance: {
                        value: 0,
                        helperText: '',
                    },
                    reminders: {
                        value: [],
                        helperText: '',
                    },
                    servicesFeesIDS: {
                        value: [],
                        helperText: '',
                    },
                });
            } else {
                const {
                    name,
                    phone,
                    email,
                    balance,
                    reminders,
                    servicesFeesIDS,
                } = this.state;
                this.setState({
                    formTitleAction: 'Edit',
                    submitFormButtonTitle: 'Save changes',
                    name: { ...name, value: itemToEdit.name },
                    phone: { ...phone, value: itemToEdit.phone },
                    email: { ...email, value: itemToEdit.email },
                    balance: { ...balance, value: itemToEdit.balance },
                    reminders: { ...reminders, value: itemToEdit.reminders },
                    servicesFeesIDS: {
                        ...servicesFeesIDS,
                        value: itemToEdit.servicesFeesIDS,
                    },
                });
            }
        }
    }

    isEditAction = () => {
        const { formTitleAction } = this.state;
        return formTitleAction === 'Edit';
    };

    handleAccountAction = (event) => {
        event.preventDefault();
        if (this.isFormValid()) {
            const {
                name,
                phone,
                email,
                balance,
                reminders,
                servicesFeesIDS,
            } = this.state;
            const account = {
                name: name.value,
                phone: phone.value,
                email: email.value,
                balance: balance.value,
                reminders: reminders.value,
                servicesFeesIDS: servicesFeesIDS.value,
            };
            if (this.isEditAction()) {
                this.props.firebase
                    .setAccount(this.props.itemToEdit.id, account)
                    .then((res) => this.props.onClose())
                    .catch((error) => this.props.onClose(error));
            } else {
                this.props.firebase
                    .saveAccount(account)
                    .then((res) => this.props.onClose())
                    .catch((error) => this.props.onClose(error));
            }
        }
    };

    isFormValid = () => {
        return (
            this.isNameValid() &&
            this.isPhoneValid() &&
            this.isEmailValid() &&
            this.isBalanceValid()
        );
    };

    isNameValid = () => {
        const { name } = this.state;
        return name.helperText === '';
    };

    validateName = () => {
        const { name } = this.state;
        const validateNameState = { ...name, helperText: '' };
        if (name.value.length < 3) {
            validateNameState.helperText = 'Name too short';
        }
        this.setState({ name: validateNameState });
    };

    isPhoneValid = () => {
        const { phone } = this.state;
        return phone.helperText === '';
    };

    validatePhone = () => {
        const { phone } = this.state;
        const validatePhoneState = { ...phone, helperText: '' };
        if (phone.value.length < 8) {
            validatePhoneState.helperText =
                'You must enter a valid phone number';
        }
        this.setState({ phone: validatePhoneState });
    };

    isEmailValid = () => {
        const { email } = this.state;
        return email.helperText === '';
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

    isBalanceValid = () => {
        const { balance } = this.state;
        return balance.helperText === '';
    };

    validateBalance = () => {
        const { balance } = this.state;
        const validateBalanceState = { ...balance, helperText: '' };
        if (!isFloatValid(balance.value)) {
            validateBalanceState.helperText = 'You must enter a valid number';
        }
        this.setState({ balance: validateBalanceState });
    };

    render() {
        const {
            formTitleAction,
            submitFormButtonTitle,
            name,
            phone,
            email,
            balance,
            reminders,
            servicesFeesIDS,
            fetchedServicesFees,
        } = this.state;
        return (
            <Dialog
                open={this.props.open}
                onClose={() => this.props.onClose()}
                aria-labelledby="form-dialog-form-title"
            >
                <DialogTitle id="form-dialog-form-title">
                    {`${formTitleAction} account`}
                </DialogTitle>
                <form onSubmit={this.handleAccountAction}>
                    <DialogContent>
                        <FormControl
                            error={!this.isNameValid()}
                            required
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-name">
                                Name
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-name"
                                value={name.value}
                                onBlur={this.validateName}
                                onChange={(e) => {
                                    this.setState({
                                        name: {
                                            ...name,
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                }
                                labelWidth={60}
                            />
                            <FormHelperText id="name-helper-text">
                                {name.helperText}
                            </FormHelperText>
                        </FormControl>
                        <FormControl
                            error={!this.isPhoneValid()}
                            required
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-phone">
                                Phone
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-phone"
                                value={phone.value}
                                onBlur={this.validatePhone}
                                onChange={(e) => {
                                    this.setState({
                                        phone: {
                                            ...phone,
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Phone />
                                    </InputAdornment>
                                }
                                labelWidth={60}
                            />
                            <FormHelperText id="phone-helper-text">
                                {phone.helperText}
                            </FormHelperText>
                        </FormControl>
                        <FormControl
                            error={!this.isEmailValid()}
                            required
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-email">
                                Email
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-email"
                                value={email.value}
                                onBlur={this.validateEmail}
                                onChange={(e) => {
                                    this.setState({
                                        email: {
                                            ...email,
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                }
                                labelWidth={60}
                            />
                            <FormHelperText id="email-helper-text">
                                {email.helperText}
                            </FormHelperText>
                        </FormControl>
                        <FormControl
                            error={!this.isBalanceValid()}
                            required
                            variant="outlined"
                        >
                            <InputLabel htmlFor="outlined-adornment-balance">
                                Balance
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-balance"
                                value={balance.value}
                                onBlur={this.validateBalance}
                                onChange={(e) => {
                                    this.setState({
                                        balance: {
                                            ...balance,
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AccountBalance />
                                    </InputAdornment>
                                }
                                labelWidth={60}
                            />
                            <FormHelperText id="balance-helper-text">
                                {balance.helperText}
                            </FormHelperText>
                        </FormControl>
                        <FormControl variant="outlined">
                            <InputLabel
                                htmlFor="outlined-adornment-reminders"
                                id="outlined-adornment-reminders"
                            >
                                Reminders
                            </InputLabel>
                            <Select
                                labelId="outlined-adornment-reminders"
                                id="outlined-adornment-reminders-select"
                                multiple
                                value={reminders.value}
                                onChange={(e) => {
                                    this.setState({
                                        reminders: {
                                            ...reminders,
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                labelWidth={60}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <AddAlert />
                                    </InputAdornment>
                                }
                            >
                                {REMINDERS.map((reminder) => (
                                    <MenuItem key={reminder} value={reminder}>
                                        {reminder}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined">
                            <InputLabel
                                htmlFor="outlined-adornment-services-fees-ids"
                                id="outlined-adornment-services-fees-ids"
                            >
                                Services Fees
                            </InputLabel>
                            <Select
                                labelId="outlined-adornment-services-fees-ids"
                                id="outlined-adornment-services-fees-ids-select"
                                multiple
                                value={servicesFeesIDS.value}
                                onChange={(e) => {
                                    this.setState({
                                        servicesFeesIDS: {
                                            ...servicesFeesIDS,
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                labelWidth={60}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <LocalAtm />
                                    </InputAdornment>
                                }
                            >
                                {fetchedServicesFees.map((servicesFee) => (
                                    <MenuItem
                                        key={servicesFee.id}
                                        value={servicesFee.id}
                                    >
                                        {servicesFee.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => this.props.onClose()}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button color="primary" type="submit">
                            {submitFormButtonTitle}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

export default withFirebase(AccountDialogForm);
