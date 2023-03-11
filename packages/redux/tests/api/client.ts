// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
// I borrowed from https://github.com/reduxjs/redux-essentials-example-app/blob/tutorial-steps/src/api/client.js

export async function client(
    endpoint: string,
    { body, ...customConfig }: any = {}
) {
    const headers = { 'Content-Type': 'application/json' };

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let data;
    try {
        const response = await window.fetch(endpoint, config);
        data = await response.json();
        if (response.ok) {
            // Return a result object similar to Axios
            return {
                status: response.status,
                data,
                headers: response.headers,
                url: response.url,
            };
        }
        throw new Error(response.statusText);
    } catch (err: any) {
        return Promise.reject(err.message ? err.message : data);
    }
}

client.get = function (endpoint: string, customConfig: any = {}) {
    return client(endpoint, { ...customConfig, method: 'GET' });
};

client.post = function (endpoint: string, body: any, customConfig: any = {}) {
    return client(endpoint, { ...customConfig, body });
};
