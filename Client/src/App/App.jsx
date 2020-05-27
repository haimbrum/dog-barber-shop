import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import LoginPage  from '../LoginPage/LoginPage';
import SignUpPage  from '../SignUpPage/SignUpPage';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    logout() {
        authenticationService.logout();
        history.push('/login');
    }

    render() {
        const { currentUser } = this.state;
        return (
            <Router history={history}>

                {currentUser &&
                    <AppBar position="static">
                        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>

                            <Typography variant="h6" >

                                {`Wellcome ${currentUser.username}!`}
                            </Typography>

                            <Button onClick={this.logout} color="inherit">Logout</Button>
                        </Toolbar>
                    </AppBar>


                }
                {/* <div className="jumbotron"> */}
                    <Container maxWidth="sm">
                        <PrivateRoute exact path="/" component={HomePage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/sign-up" component={SignUpPage} />



                    </Container>
                {/* </div> */}
            </Router>
        );
    }
}

export { App }; 