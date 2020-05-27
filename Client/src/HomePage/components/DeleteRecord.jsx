
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { recordService } from '@/_services'


export default class DeleteRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    handleClose() {
        this.setState({ open: false })
    }

    handleOpen() {
        this.setState({ open: true })
    }

    handleDateChange(value) {
        this.setState({ selectedDate: value });
    }

    handleDelete() {
        recordService.deleteRecord(this.props.data.id).then(() => this.setState({ open: false })).then(() => this.props.onActionComplete());
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete Your Appointment</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                    Are you sure you want to delete this record?
                      </Typography>

                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleClose()}>
                        Cancel
                  </Button>

                    <Button color="primary" onClick={() => this.handleDelete()}>
                        Delete
                  </Button>

                </DialogActions>
            </Dialog>
        )
    }
}
