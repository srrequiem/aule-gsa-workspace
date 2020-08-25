import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from "@material-ui/core";

export const DeleteDialog = props => (
    <Dialog
        open={props.open}
        onClose={() => props.handleConfirmation(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
    >
        <DialogTitle id="delete-dialog-title">
            Delete this {props.entity}?
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="delete-dialog-description">
                You won't be able to recover it.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={() => props.handleConfirmation(false)}
                color="primary"
                autoFocus
            >
                Cancel
            </Button>
            <Button
                onClick={() => props.handleConfirmation(true)}
                color="secondary"
            >
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);