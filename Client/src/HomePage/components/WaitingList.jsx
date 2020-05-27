import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';


import RecordDetails from './RecordDetails';
import EditRecord from './EditRecord';
import AddNewRecord from './AddNewRecord';
import DeleteRecord from './DeleteRecord';

import { recordService } from '@/_services';
import { getLocalISODate } from '@/_helpers';

export default class WaitingList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            queryText: '',
            fromDate: null,
            untilDate: null,
            dialog: {
                open: false,
                data: {}
            }
        }

        this.dialogRefs = {
            details: React.createRef(),
            edit: React.createRef(),
            delete: React.createRef()
        };
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {

        const formatedFromDate = this.state.fromDate ? this.state.fromDate.toISOString() : '';
        const formatedUntilDate = this.state.untilDate ? this.state.untilDate.toISOString() : '';
        recordService.getAll(this.state.queryText, formatedFromDate, formatedUntilDate)
            .then(res => {
                this.setState({ rows: res })
            });
    }

    handleRecordClick(row) {
        this.setState({
            dialog: {
                open: true,
                data: row
            }
        });

        this.dialogRefs.details.current.handleOpen();
    }

    handleEditRecordClick(row) {
        this.setState({
            dialog: {
                open: true,
                data: row
            }
        });

        this.dialogRefs.edit.current.handleOpen();
    }

    handleDeleteRecordClick(row) {
        this.setState({
            dialog: {
                open: true,
                data: row
            }
        });

        this.dialogRefs.delete.current.handleOpen();
    }

    inputSearchChanged(e) {
        this.setState({ queryText: e.target.value }, this.fetchData);
    }

    handleFromDateChange(date) {
        this.setState({ fromDate: date }, this.fetchData);
    }

    handleUntilDateChange(date) {
        this.setState({ untilDate: date }, this.fetchData);
    }

    render() {
        return (
            <div>
                <RecordDetails ref={this.dialogRefs.details} data={this.state.dialog.data} />
                <EditRecord ref={this.dialogRefs.edit} data={this.state.dialog.data} onActionComplete={() => this.fetchData()} />
                <DeleteRecord ref={this.dialogRefs.delete} data={this.state.dialog.data} onActionComplete={() => this.fetchData()} />

                <Box style={{ paddingTop: '30px', display: 'flex', justifyContent: 'space-between' }}>

                    <TextField
                        // className={classes.margin}
                        style={{ width: '80%' }}
                        id="input-with-icon-textfield"
                        placeholder="Search for name"
                        onChange={(e) => this.inputSearchChanged(e)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <AddNewRecord style={{ width: '20%' }} userId={this.props.currentUser.id} onActionComplete={() => this.fetchData()} />
                </Box>
                <Paper style={{ marginBottom: '20px', padding: '20px', display: 'flex', justifyContent: 'space-around' }}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                name="fromDate"
                                clearable
                                value={this.state.fromDate}
                                onChange={(e) => this.handleFromDateChange(e)}
                                label="Show only from date"
                            />


                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                name="untilDate"
                                clearable
                                value={this.state.untilDate}
                                onChange={(e) => this.handleUntilDateChange(e)}
                                label="Show only Until date"
                            />
                        </MuiPickersUtilsProvider>
                </Paper>


                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Actions</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="right">Scheduled date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map((row, index) => (

                                <TableRow hover key={row.id} onClick={() => this.handleRecordClick(row)}>

                                    <TableCell align="left" >
                                        {row.userId === this.props.currentUser.id &&
                                            <div>
                                                <IconButton onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.handleDeleteRecordClick(row)
                                                }} aria-label="delete">

                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.handleEditRecordClick(row)
                                                }} aria-label="edit">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </div>}
                                    </TableCell>
                                    <TableCell align="center" component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{new Date(row.scheduledDate).toLocaleString()}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>);
    }
}
