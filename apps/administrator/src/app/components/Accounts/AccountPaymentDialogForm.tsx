import React, { Component } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    FormHelperText,
    Button,
} from '@material-ui/core';
import { AttachMoney } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import { isFloatValid } from '../../utils/Validation';
import { withFirebase } from '../../hoc/FirebaseContext';
import Firebase from '../../providers/Firebase';

interface AccountPaymentFormProps {
    accountID: string,
    firebase: Firebase,
    onClose(): void,
    open: boolean
}

class AccountPaymentForm extends Component<AccountPaymentFormProps> {
    state = {
        amount: {
            value: '',
            helperText: '',
        },
        date: {
            value: new Date(),
            helperText: '',
        },
    };

    onPaymentCreation = (event) => {
        event.preventDefault();
        if (this.isFormValid()) {
            const { amount, date } = this.state;
            const payment = {
                accountID: this.props.accountID,
                amount: parseFloat(amount.value),
                date: date.value,
            };
            this.props.firebase
                .savePayment(payment)
                .then((res) => {
                    this.props.onClose();
                    console.log(res);
                })
                .catch((error) => console.log(error));
        }
    };

    isFormValid = () => {
        return this.isAmountValid();
    };

    isAmountValid = () => {
        const { amount } = this.state;
        return amount.helperText === '';
    };

    validateAmount = () => {
        const { amount } = this.state;
        const validateAmountState = {
            ...amount,
            helperText: '',
        };
        if (!isFloatValid(amount.value)) {
            validateAmountState.helperText = 'You must enter a valid number';
        }
        this.setState({ amount: validateAmountState });
    };

    render() {
        const { amount, date } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-payment"
                >
                    <form onSubmit={this.onPaymentCreation}>
                        <DialogTitle id="form-dialog-payment">
                            Account Payment
                        </DialogTitle>
                        <DialogContent>
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
                                label="Payment Date"
                                format="MM/dd/yyyy"
                                value={date.value}
                                onChange={(date) => {
                                    this.setState({
                                        date: {
                                            ...date,
                                            value: date,
                                        },
                                    });
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.props.onClose}>Cancel</Button>
                            <Button color="primary" type="submit">
                                Add
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </MuiPickersUtilsProvider>
        );
    }
}

export default withFirebase(AccountPaymentForm);
