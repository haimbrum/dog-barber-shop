
import React, { useState } from 'react';
import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddBox from '@material-ui/icons/AddBox';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { recordService } from '@/_services'
import { getLocalISODate } from '@/_helpers';

export default class AddNewRecord extends React.Component {

    constructor(props) {
        super(props);
        this.state = { open: false, selectedDate: null };

    }

    handleClose() {
        this.setState({ open: false })
    }

    handleOpen() {
        this.setState({ open: true, selectedDate: null })
    }

    handleSave() {
        recordService.addNewRecord(getLocalISODate(this.state.selectedDate)).then(() => this.setState({ open: false })).then(() => this.props.onActionComplete());
    }

    handleDateChange(value) {
        this.setState({ selectedDate: value });
    }



    render() {


        return (
            <div>
                <IconButton onClick={() => this.handleOpen()} aria-label="add" >
                    <AddBox fontSize="large" />
                </IconButton>
                <Dialog open={this.state.open} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Appointment</DialogTitle>
                    <DialogContent>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                clearable
                                value={this.state.selectedDate}
                                onChange={(c) => this.handleDateChange(c)}
                                label="Choose date"
                            />
                        </MuiPickersUtilsProvider>

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.handleClose()}>
                            Cancel
                  </Button>
                        <Button color="primary" onClick={() => this.handleSave()}>
                            Save
                  </Button>


                    </DialogActions>
                </Dialog>
            </div>

        )
    }
}
