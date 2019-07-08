const express = require('express');

const server = express();

server.use(express.json());

const users = ['Lucas', 'João', 'Victor'];

server.use((req, res, next) => {
    console.time('Request');

    console.log(`Método: ${req.method}; URL: ${req.url};`);

    next();

    console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({error: 'User name is required'});
    }

    return next();
}

function checkUserInArray(req, res, next) {
    const { id } = req.params;

    if (!users[id]) {
        return res.status(400).json({error: 'User does not exists'});
    }

    req.user = users[id];

    return next();
}

server.get('/users', (req, res) => {
    return res.json(users);
});

server.get('/users/:id', checkUserInArray, (req, res) => {
    return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {
    const { name } = req.body;

    users.push(name);

    return res.json(users);
});

server.put('/users/:id', checkUserExists, checkUserInArray, (req, res) => {
    const { id } = req.params;
    
    const { name } = req.body;

    users[id] = name;

    return res.json(users);
});

server.delete('/users/:id', checkUserInArray, (req, res) => {
    const { id } = req.params;

    users.splice(id, 1);

    return res.json();
});

server.listen(3000, console.log('Listen port 3000'));