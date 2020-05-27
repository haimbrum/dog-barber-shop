import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { authenticationService } from '@/_services';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';



const styles = theme => ({
    alert: {
        width: '100%'
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});


class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            formValid: false,
            authFailed: false,
            errorMessage: null
        }

        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const username = this.state.username;
        const password = this.state.password;
        authenticationService.signUp(username, password)
            .then(
                user => {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    this.props.history.push(from);
                },
                error => this.setState({ authFailed: true, errorMessage: error })
            );
    }

    handleInputChanged(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value }, this.setFormValidation);

    }

    setFormValidation() {
        const username = this.state.username;
        const password = this.state.password;

        const formIsValid = (username != null && username != "" && password != null && password != "")
        this.setState({
            formIsValid: formIsValid
        })

    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.paper}>

                <Typography component="h1" variant="h5">
                    Sign up
            </Typography>
                <form onSubmit={(e) => this.handleSubmit(e)} className={classes.form}>
                    <TextField
                        onChange={(e) => this.handleInputChanged(e)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoFocus
                    />
                    <TextField
                        onChange={(e) => this.handleInputChanged(e)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button
                        disabled={!this.state.formIsValid}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
              </Button>
                    <Grid container>
                        <Grid item xs>

                        </Grid>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
                { this.state.authFailed && <Alert className={classes.alert} severity="error">{this.state.errorMessage}</Alert>}
            </div>

        )
    }
}
SignUpPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUpPage); 