import React, { Component } from "react";
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
} from "@material-ui/core";
import { LocalAtm, AttachMoney, Person } from "@material-ui/icons";
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";

import { ServicesFee } from "@aule-gsa-workspace/interfaces";
import { isFloatValid, isObjectEmpty } from "../../utils/Validation";
import { withFirebase } from "../../hoc/FirebaseContext";
import Firebase from '../../providers/Firebase';

interface ServicesFeeDialogFormProps {
    firebase: Firebase,
    itemToEdit: ServicesFee,
    open: boolean,
    onClose(error?: string): void,
}

class ServicesFeeDialogForm extends Component<ServicesFeeDialogFormProps> {
    state = {
        formTitleAction: "New",
        submitFormButtonTitle: "Add service fee",
        name: {
            value: "",
            helperText: "",
        },
        amount: {
            value: 0,
            helperText: "",
        },
        triggerDate: {
            value: new Date(),
            helperText: "",
        },
        accounts: {
            value: [],
            helperText: "",
        },
        fetchedAccounts: [],
    };

    componentDidMount() {
        this.props.firebase.getAccounts().then((snapshots) => {
            const fetchedAccounts = [];
            snapshots.forEach((doc) =>
                fetchedAccounts.push({ id: doc.id, ...doc.data() })
            );
            this.setState({ fetchedAccounts });
        });
    }

    componentDidUpdate(prevProps) {
        const { itemToEdit } = this.props;
        if (prevProps.itemToEdit !== itemToEdit) {
            if (isObjectEmpty(itemToEdit)) {
                this.setState({
                    formTitleAction: "New",
                    submitFormButtonTitle: "Add service fee",
                    name: {
                        value: "",
                        helperText: "",
                    },
                    amount: {
                        value: 0,
                        helperText: "",
                    },
                    triggerDate: {
                        value: new Date(),
                        helperText: "",
                    },
                    accounts: {
                        value: [],
                        helperText: "",
                    },
                });
            } else {
                const { name, amount, triggerDate, accounts } = this.state;
                this.setState({
                    formTitleAction: "Edit",
                    submitFormButtonTitle: "Save changes",
                    name: { ...name, value: itemToEdit.name },
                    amount: { ...amount, value: itemToEdit.amount },
                    triggerDate: {
                        ...triggerDate,
                        value: itemToEdit.triggerDate.toDate(),
                    },
                    accounts: {
                        ...accounts,
                        value: itemToEdit.accountsIDS,
                    },
                });
            }
        }
    }

    onFeeCreation = (event) => {
        event.preventDefault();
        if (this.isFormValid()) {
            const { name, amount, triggerDate, accounts } = this.state;
            const fee = {
                name: name.value,
                amount: amount.value,
                triggerDate: triggerDate.value,
                accountsIDS: accounts.value,
            };
            if (this.isEditAction()) {
                this.props.firebase
                    .setServicesFee(this.props.itemToEdit.id, fee)
                    .then((res) => this.props.onClose())
                    .catch((error) => this.props.onClose(error));
            } else {
                this.props.firebase
                    .saveServicesFee(fee)
                    .then((res) => this.props.onClose())
                    .catch((error) => this.props.onClose(error));
            }
        }
    };

    isEditAction = () => {
        const { formTitleAction } = this.state;
        return formTitleAction === "Edit";
    };

    isFormValid = () => {
        return this.isNameValid() && this.isAmountValid();
    };

    isNameValid = () => {
        const { name } = this.state;
        return name.helperText === "";
    };

    validateName = () => {
        const { name } = this.state;
        const validateNameState = { ...name, helperText: "" };
        if (name.value.length < 3) {
            validateNameState.helperText = "Name too short";
        }
        this.setState({ name: validateNameState });
    };

    isAmountValid = () => {
        const { amount } = this.state;
        return amount.helperText === "";
    };

    validateAmount = () => {
        const { amount } = this.state;
        const validateAmountState = {
            ...amount,
            helperText: "",
        };
        if (!isFloatValid(amount.value)) {
            validateAmountState.helperText = "You must enter a valid number";
        }
        this.setState({ amount: validateAmountState });
    };

    render() {
        const {
            formTitleAction,
            submitFormButtonTitle,
            name,
            amount,
            triggerDate,
            accounts,
            fetchedAccounts,
        } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.onClose()}
                    aria-labelledby="form-dialog-form-title"
                >
                    <DialogTitle id="form-dialog-form-title">
                        {`${formTitleAction} service fee`}
                    </DialogTitle>
                    <form onSubmit={this.onFeeCreation}>
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
                                            <LocalAtm />
                                        </InputAdornment>
                                    }
                                    labelWidth={60}
                                />
                                <FormHelperText id="name-helper-text">
                                    {name.helperText}
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                error={!this.isAmountValid()}
                                required
                                variant="outlined"
                            >
                                <InputLabel htmlFor="outlined-amount">
                                    Amount
                                </InputLabel>
                                <OutlinedInput
                                    id="outlined-amount"
                                    value={amount.value}
                                    onBlur={this.validateAmount}
                                    onChange={(e) => {
                                        this.setState({
                                            amount: {
                                                ...amount,
                                                value: e.target.value,
                                            },
                                        });
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AttachMoney />
                                        </InputAdornment>
                                    }
                                    labelWidth={60}
                                />
                                <FormHelperText id="amount-helper-text">
                                    {amount.helperText}
                                </FormHelperText>
                            </FormControl>
                            <KeyboardDatePicker
                                required
                                inputVariant="outlined"
                                id="date-picker-dialog"
                                label="Trigger Date"
                                format="MM/dd/yyyy"
                                value={triggerDate.value}
                                onChange={(date) => {
                                    this.setState({
                                        triggerDate: {
                                            ...triggerDate,
                                            value: date,
                                        },
                                    });
                                }}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                            <FormControl variant="outlined">
                                <InputLabel
                                    htmlFor="outlined-adornment-accounts"
                                    id="outlined-adornment-accounts"
                                >
                                    Accounts
                                </InputLabel>
                                <Select
                                    labelId="outlined-adornment-accounts"
                                    id="outlined-adornment-accounts-select"
                                    multiple
                                    value={accounts.value}
                                    onChange={(e) => {
                                        this.setState({
                                            accounts: {
                                                ...accounts,
                                                value: e.target.value,
                                            },
                                        });
                                    }}
                                    labelWidth={60}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    }
                                >
                                    {fetchedAccounts.map((account) => (
                                        <MenuItem
                                            key={account.id}
                                            value={account.id}
                                        >
                                            {account.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.props.onClose()}>
                                Cancel
                            </Button>
                            <Button color="primary" type="submit">
                                {submitFormButtonTitle}
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </MuiPickersUtilsProvider>
        );
    }
}

export default withFirebase(ServicesFeeDialogForm);
