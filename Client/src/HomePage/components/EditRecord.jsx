
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { recordService } from '@/_services';
import { getLocalISODate } from '@/_helpers';


export default class EditRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selectedDate: null
        };
    }

    handleClose() {
        this.setState({ open: false })
    }

    handleOpen() {
        this.setState({ open: true, selectedDate: null });
    }

    handleDateChange(value) {
        this.setState({ selectedDate: value });
    }

    handleSave() {
        if (this.state.selectedDate) {
            const dateFormated = getLocalISODate(this.state.selectedDate)
            recordService.updateRecord(this.props.data.id, dateFormated)
                .then(() => this.setState({ open: false }))
                .then(() => this.setState({ selectedDate: null }))
                .then(() => this.props.onActionComplete());
        } else {
            this.handleClose();
        }
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Your Appointment</DialogTitle>
                <DialogContent>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            clearable
                            value={this.state.selectedDate}
                            onChange={(value) => this.handleDateChange(value)}
                            label="Choose date"
                        />
                    </MuiPickersUtilsProvider>

                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleClose()}>
                        Close
                  </Button>

                    <Button color="primary" onClick={() => this.handleSave()}>
                        Save
                  </Button>

                </DialogActions>
            </Dialog>
        )
    }
}
