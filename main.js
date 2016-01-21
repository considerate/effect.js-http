import {Effect, Types, Action} from 'effectjs';

export const Actions = Types('error', 'response');

const Effects = Types('request');
export const performer = {
    [Effects.request]: (effect) => {
        const {data} = effect;
        const {method, url, headers, body} = data;
        return fetch(url, {headers, method, body})
        .then(response => {
            if(response.status >= 400 && response.status < 600) {
                return Action(Actions.error, {
                    url,
                    message: 'Failed to perform HTTP request',
                    text: response.text
                });
            } else {
                return response.json().then(jsonData => {
                    return Action(Actions.response, {
                        url,
                        body: jsonData
                    });
                });
            }
        })
        .catch(err => {
            return Action(Actions.error, {
                url,
                message: err.message,
                stack: err.stack
            });
        });
    },
};

export const HTTPRequest = (method, url, body, headers) => {
    return Effect(Effects.request, {
        method,
        url,
        body,
        headers
    });
}

