import React from 'react';
import { userService, authenticationService } from '@/_services';
import WaitingList from './components/WaitingList'



class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            columns: [
                { title: 'Name', field: 'name' },
                { title: 'Scheduled Date', field: 'scheduledDate', type: 'datetime' },
            ],
            userId: 1
        }
    }



    render() {
        return (
            <WaitingList currentUser={this.state.currentUser} />
        );
    }
}

export { HomePage };