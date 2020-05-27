
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

export default class RecordDetails extends React.Component {
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

    render() {
        const scheduledDateLocale = new Date(this.props.data.scheduledDate).toLocaleString();
        const recordCreatedLocale = new Date(this.props.data.dateCreated).toLocaleString();

        return (
            <Dialog open={this.state.open} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Customer: {this.props.data.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        Visiting date: {scheduledDateLocale}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        Record created: {recordCreatedLocale}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleClose()}>
                        Close
                  </Button>
                </DialogActions>
            </Dialog>
        )
    }
}
