
import { authHeader, handleResponse } from '@/_helpers';
import config from 'config';

export const recordService = {
    addNewRecord,
    updateRecord,
    deleteRecord,
    getAll
}

function addNewRecord(date) {

    return new Promise((resolve) => {
        const url = `${config.apiUrl}/records`;
        const body = { scheduledDate: date }; 

        fetch(url, {
            method: 'POST',
            headers:  { 'Content-Type': 'application/json', ...authHeader() },
            body: JSON.stringify(body)
        }).then().then(handleResponse).then(res => {
            resolve(true)
        });
    })
}

function updateRecord(id, scheduledDate) {

    return new Promise((resolve) => {
        const url = `${config.apiUrl}/records/${id}`;
        const body = { scheduledDate: scheduledDate };

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeader() },
            body: JSON.stringify(body)
        }).then().then(handleResponse).then(res => {
            resolve(true)
        });
    })
}

function deleteRecord(recordId) {
    return new Promise((resolve) => {
        const url = `${config.apiUrl}/records/${recordId}`;

        fetch(url, {
            method: 'DELETE',
            headers: authHeader()
        }).then(handleResponse).then().then(res => {
            resolve(true)
        });
    })
}

function getAll(queryText, fromDate, untilDate) {
    const url = new URL(`${config.apiUrl}/records`);
    // const url = `${config.apiUrl}/records?query=${queryText}&from_date=${fromDate}&until_date=${untilDate}`;

    let params = { }

    if (queryText) {
        params['query'] = queryText;
    }
    if (fromDate) {
        params['from_date'] = fromDate;
    }
    if (untilDate) {
        params['until_date'] = untilDate;
    }

    url.search = new URLSearchParams(params).toString();

    const requestOptions = { method: 'GET', headers: authHeader() };

    return fetch(url, requestOptions).then(handleResponse);
}