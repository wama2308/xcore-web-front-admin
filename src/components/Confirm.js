import React, { Component } from "react";
import { Button, ModalHeader, ModalBody, ModalFooter, Modal } from "reactstrap";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export class Alert extends React.Component {
    handleOk = () => {
        this.props.callback(true);
        this.props.close()
    };

    handleNotOk = () => {
        this.props.callback(false);
        this.props.close()
    };

    render() {
        return (
            <Dialog
                fullWidth={true}
                maxWidth="sm"
                open={this.props.open}
                onClose={this.closeModal}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent dividers>{this.props.info}{" "}</DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={this.handleNotOk}>
                        No
                    </Button>
                    <Button color="primary" onClick={this.handleOk}>
                        Si
                    </Button>{" "}

                </DialogActions>
            </Dialog>
        );
    }
}
