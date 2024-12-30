const express = require('express');

const app = express();
const PORT = process.env.PORT || 3006;

let services = {};

app.post('/register', (req, res) => {
    const { name, url } = req.body;
    services[name] = url;
    res.send(`Service ${name} registered`);
});

app.get('/services', (req, res) => {
    res.json(services);
});

app.listen(PORT, () => {
    console.log(`Service Registry running on port ${PORT}`);
});