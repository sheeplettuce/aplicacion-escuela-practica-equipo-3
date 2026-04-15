let clients = [];

export const addClient = (res) => {
    clients.push(res);
};

export const removeClient = (res) => {
    clients = clients.filter(c => c !== res);
};

export const sendEvent = (event, data) => {
    clients.forEach(client => {
        client.write(`event: ${event}\n`);
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};